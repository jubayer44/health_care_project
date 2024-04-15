import axios from "axios";
import prisma from "../../../shared/prisma";
import { SslService } from "../SSL/ssl.service";
import config from "../../../config";
import { PaymentStatus } from "@prisma/client";

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const result = await SslService.initPayment(paymentData);

  return {
    paymentUrl: result,
  };
};

const validationPayment = async (payload: any) => {
  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return {
  //     message: "Invalid Payment",
  //   };
  // }

  // const response = await SslService.validationPayment(payload);

  // if (response.status !== "VALID") {
  //   return {
  //     message: "Payment Failed",
  //   };
  // }

  const response = payload; // For local testing

  await prisma.$transaction(async (tx) => {
    const paymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });

    await tx.appointment.update({
      where: {
        id: paymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });

    return paymentData;
  });

  return {
    message: "Payment Success",
  };
};

export const PaymentService = {
  initPayment,
  validationPayment,
};
