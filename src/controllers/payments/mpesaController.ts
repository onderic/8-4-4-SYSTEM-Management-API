import { Request, Response } from 'express';
import request from 'request';
import 'dotenv/config';
import { getTimestamp } from '../../utils/utils.timestamp';
import ngrok from 'ngrok'; // Import ngrok

import { Staff } from '../../models/staff';
import { Mpesa } from '../../models/mpesa';

interface CallbackMetadataItem {
  Name: string;
  Value?: string | number;
}


// @desc initiate stk push
// @method POST
// @route /stkPush
// @access public
export const initiateSTKPush = async (req: Request, res: Response) => {
  try {
    const { amount, phone, Order_ID } = req.body;
    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const auth = 'Bearer ' + (req.safaricom_access_token);

    const timestamp = getTimestamp();
    // shortcode + passkey + timestamp
    const password = Buffer.from(
      (process.env.BUSINESS_SHORT_CODE ?? '') + (process.env.PASS_KEY ?? '') + timestamp
    ).toString('base64');

    // Automatically create Ngrok tunnel
    const callback_url = await ngrok.connect({
      addr: 3000,
      authtoken: process.env.NGROK_AUTH_TOKEN,
    });

    console.log('Ngrok tunnel URL:', callback_url);

    request(
      {
        url: url,
        method: 'POST',
        headers: {
          Authorization: auth,
        },
        json: {
          BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phone,
          PartyB: process.env.BUSINESS_SHORT_CODE,
          PhoneNumber: phone,
          CallBackURL: `${callback_url}/api/v1/pay/stkPushCallback/${Order_ID}`,
          AccountReference: 'Shopyetu Online Shop',
          TransactionDesc: 'Paid online',
        },
      },
      (e, response, body) => {
        if (e) {
          console.error(e);
          res.status(503).send({
            message: 'Error with the stk push',
            error: e,
          });
        } else {
          res.json({
            success: true,
            message: 'Your payment has been initiated successfully. Please check your phone for the push notification',
            body,
          });
        }
      }
    );
  } catch (e) {
    console.error('Error while trying to create LipaNaMpesa details', e);
    res.status(503).send({
      message: 'Something went wrong while trying to create LipaNaMpesa details. Contact admin',
      error: e,
    });
  }
};

// @desc callback route Safaricom will post transaction status
// @method POST
// @route /stkPushCallback/:Order_ID
// @access public
export const stkPushCallback = async (req: Request, res: Response) => {
  try {
    const { Order_ID } = req.params;

    // Callback details
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = req.body.Body.stkCallback || {};

    console.log('-'.repeat(20), ' OUTPUT IN THE CALLBACK ', '-'.repeat(20));
      console.log(`
          StaffId : ${Order_ID},
          MerchantRequestID : ${MerchantRequestID},
          CheckoutRequestID: ${CheckoutRequestID},
          ResultCode: ${ResultCode},
        `)
    
    // Get the meta data from CallbackMetadata
    if (CallbackMetadata && CallbackMetadata.Item) {
      // Get the meta data from CallbackMetadata
      const meta: CallbackMetadataItem[] = Object.values(CallbackMetadata.Item);
      const PhoneNumber = meta.find((o) => o.Name === 'PhoneNumber')?.Value?.toString() || '';
      const Amount = parseFloat(meta.find((o) => o.Name === 'Amount')?.Value?.toString() || '0');
      const MpesaReceiptNumber = meta.find((o) => o.Name === 'MpesaReceiptNumber')?.Value?.toString() || '';
      const TransactionDate = meta.find((o) => o.Name === 'TransactionDate')?.Value?.toString() || '';

      // Do something with the data
      console.log('-'.repeat(20), ' OUTPUT IN THE CALLBACK ', '-'.repeat(20));
      console.log(`
          StaffId : ${Order_ID},
          MerchantRequestID : ${MerchantRequestID},
          CheckoutRequestID: ${CheckoutRequestID},
          ResultCode: ${ResultCode},
          ResultDesc: ${ResultDesc},
          PhoneNumber : ${PhoneNumber},
          Amount: ${Amount}, 
          MpesaReceiptNumber: ${MpesaReceiptNumber},
          TransactionDate : ${TransactionDate}
      `);

      // Update or create a record in the Mpesa model
      const mpesaRecord = await Mpesa.create({
        PhoneNumber,
        Amount,
        ResultCode,
        MerchantRequestID,
        CheckoutRequestID,
        ResultDesc,
        MpesaReceiptNumber,
        TransactionDate,
        staffId:Order_ID,
      });

      console.log("New record", mpesaRecord)

      // Assuming you have a staffId associated with the Order_ID
      const staffRecord = await Staff.findOne({
        where: { id: Order_ID },
      }as any);

      if (staffRecord) {
        
        await staffRecord.update({ is_paid: true });
      }

      res.json(true);
    }
  } catch (e) {
    console.error('Error while trying to update LipaNaMpesa details from the callback', e);
    res.status(503).send({
      message: 'Something went wrong with the callback',
      error: e,
    });
  }
};