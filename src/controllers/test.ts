// import { Request, Response } from 'express';
// import request from 'request';
// import 'dotenv/config';
// import { getTimestamp } from '../../utils/utils.timestamp';
// import ngrok, { NgrokClient } from 'ngrok';
// import { Staff } from "../../models/staff";
// import { Mpesa } from "../../models/mpesa";


// interface CallbackMetadataItem {
//     Name: string;
//     Value?: string | number;
//   }
// interface CallbackMetadata {
// Item: CallbackMetadataItem[];
// }
  

// // @desc initiate stk push
// // @method POST
// // @route /stkPush
// // @access public
// export const initiateSTKPush = async (req: Request, res: Response) => {
//     try {
//       const { amount, phone, staffId } = req.body;
//       // console.log(`Staff ID: ${staffId}`);
//       const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
//       const auth = 'Bearer ' + (req.safaricom_access_token);
  
//       const timestamp = getTimestamp();
//       // shortcode + passkey + timestamp
//       const password =
//         Buffer.from((process.env.BUSINESS_SHORT_CODE ?? '') + (process.env.PASS_KEY ?? '') + timestamp).toString('base64');
      
//       // create callback url
//     //   const callback_url = await ngrok.connect(3000);
//     //   const api: NgrokClient | null = ngrok.getApi();
  
//     //   if (api) {
//     //     await api.listTunnels();
//     //   }
  
//     //   console.log('callback ', callback_url);
//       request(
//         {
//           url: url,
//           method: 'POST',
//           headers: {
//             Authorization: auth,
//           },
//           json: {
//             BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
//             Password: password,
//             Timestamp: timestamp,
//             TransactionType: 'CustomerPayBillOnline',
//             Amount: amount,
//             PartyA: phone,
//             PartyB: process.env.BUSINESS_SHORT_CODE,
//             PhoneNumber: phone,
//             CallBackURL: `https://ed8f-41-89-162-8.ngrok-free.app/api/v1/pay/stkPushCallback/${staffId}`,
//             AccountReference: 'Shopyetu Online Shop',
//             TransactionDesc: 'Paid online',
//           },
//         },
//         (e, response, body) => {
//           if (e) {
//             console.error(e);
//             res.status(503).send({
//               message: 'Error with the stk push',
//               error: e,
//             });
//           } else {
//             res.status(200).json(body);
//           }
//         }
//       );
//     } catch (e) {
//       console.error('Error while trying to create LipaNaMpesa details', e);
//       res.status(503).send({
//         message: 'Something went wrong while trying to create LipaNaMpesa details. Contact admin',
//         error: e,
//       });
//     }
//   };

// // @desc callback route Safaricom will post transaction status
// // @method POST
// // @route /stkPushCallback/:Order_ID
// // @access public
// export const stkPushCallback = async (req: Request, res: Response) => {
//   try {
//     const { staffId } = req.params;

//     // console.log(`Staff ID: ${staffId}`);
   
//     // Callback details
//     const {
//       MerchantRequestID,
//       CheckoutRequestID,
//       ResultCode,
//       ResultDesc,
//       CallbackMetadata,
//     } = req.body.Body.stkCallback || {};

//     // Get the meta data from CallbackMetadata
//     if (CallbackMetadata && CallbackMetadata.Item) {
//       // Get the meta data from CallbackMetadata
//       const meta: CallbackMetadataItem[] = Object.values(CallbackMetadata.Item);
//       const PhoneNumber = meta.find((o) => o.Name === 'PhoneNumber')?.Value?.toString() || '';
//       const Amount = parseFloat(meta.find((o) => o.Name === 'Amount')?.Value?.toString() || '0');
//       const MpesaReceiptNumber = meta.find((o) => o.Name === 'MpesaReceiptNumber')?.Value?.toString() || '';
//       const TransactionDate = meta.find((o) => o.Name === 'TransactionDate')?.Value?.toString() || '';

//       // Do something with the data
//       console.log('-'.repeat(20), ' OUTPUT IN THE CALLBACK ', '-'.repeat(20));
//       console.log(`
//           StaffId : ${staffId},
//           MerchantRequestID : ${MerchantRequestID},
//           CheckoutRequestID: ${CheckoutRequestID},
//           ResultCode: ${ResultCode},
//           ResultDesc: ${ResultDesc},
//           PhoneNumber : ${PhoneNumber},
//           Amount: ${Amount}, 
//           MpesaReceiptNumber: ${MpesaReceiptNumber},
//           TransactionDate : ${TransactionDate}
//       `);

//       // Update or create a record in the Mpesa model
//       const mpesaRecord = await Mpesa.create({
//         PhoneNumber,
//         Amount,
//         ResultCode,
//         MerchantRequestID,
//         CheckoutRequestID,
//         ResultDesc,
//         MpesaReceiptNumber,
//         TransactionDate,
//         staffId,
//       });

//       console.log("New record", mpesaRecord)

//       // Assuming you have a staffId associated with the Order_ID
//       const staffRecord = await Staff.findOne({
//         where: { id: staffId },
//       }as any);

//       if (staffRecord) {
//         // Update the is_paid field to true
//         await staffRecord.update({ is_paid: true });
//       }

//       res.json(true);
//     }
//   } catch (e) {
//     console.error('Error while trying to update LipaNaMpesa details from the callback', e);
//     res.status(503).send({
//       message: 'Something went wrong with the callback',
//       error: e,
//     });
//   }
// };