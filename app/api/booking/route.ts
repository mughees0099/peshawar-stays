import Booking from "@/models/Bookings";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      property,
      owner,
      customer,
      checkIn,
      checkOut,
      totalAmount,
      specialRequests,
      numberOfGuests,
      roomType,
      status,
    } = body;

    if (
      !property ||
      !owner ||
      !customer ||
      !checkIn ||
      !checkOut ||
      !totalAmount
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const overlappingBooking = await Booking.findOne({
      customer,
      property,
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      status: { $nin: ["cancelled", "completed"] },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          error:
            "You already have active booking for this property that overlaps with the selected dates.",
        },
        { status: 409 }
      );
    }

    const newBooking = await Booking.create({
      property,
      owner,
      customer,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalAmount,
      specialRequests: specialRequests || "",
      numberOfGuests: numberOfGuests || 1,
      roomType: roomType || "Standard",
      isApproved: status === "approved" ? true : false,
    });
    const booking = await Booking.findById(newBooking._id)
      .populate("property")
      .populate("customer")
      .populate("owner");

    // sent email to customer
    const customerSubject = "Booking Confirmation";
    const customerText = `Hello ${
      booking.customer.firstName.charAt(0).toUpperCase() +
      booking.customer.firstName.slice(1).toLowerCase()
    },\n\n


Thanks for booking at PeshawarStays!

Property: ${booking.property.name}\n
Location: ${booking.property.location}\n
Room Type: ${
      booking.roomType.charAt(0).toUpperCase() +
      booking.roomType.slice(1).toLowerCase()
    }\n
Guests: ${
      booking.numberOfGuests >= 5
        ? booking.numberOfGuests + "+"
        : booking.numberOfGuests
    }\n
Check-in: ${booking.checkIn.toLocaleDateString()}\n
Check-out: ${booking.checkOut.toLocaleDateString()}\n
Nights: ${Math.ceil(
      (booking.checkOut.getTime() - booking.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    )}\n

Total Amount: Rs. ${booking.totalAmount}\n
Payment Method: You will pay when you check in at the hotel.

⚠️ Your booking is pending host approval. Once approved, you won’t be able to cancel.

You’ll be notified once the host takes action.

Regards,
PeshawarStays
`;
    const customerHtml = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Booking Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #e63946;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
          }
          .section {
            margin: 20px 0;
          }
          .section-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
          }
          .section p {
            margin: 5px 0;
          }
          .footer {
            text-align: center;
            font-size: 13px;
            color: #888;
            margin-top: 30px;
          }
          .important {
            background-color: #fff3cd;
            padding: 10px;
            border: 1px solid #ffeeba;
            border-radius: 5px;
            margin-top: 15px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Received - PeshawarStays</h1>
          </div>

          <div class="section">
            <p>Hi <strong>${
              booking.customer.firstName.charAt(0).toUpperCase() +
              booking.customer.firstName.slice(1).toLowerCase()
            }</strong>,</p>
            <p>
              Thank you for booking with <strong>PeshawarStays</strong>! We have
              received your request and your booking is currently in
              <strong>Pending</strong> status.
            </p>
          </div>

          <div class="section">
            <div class="section-title">🏡 Property Details</div>
            <p><strong>Name:</strong> ${booking.property.name}</p>
            <p><strong>Location:</strong> ${booking.property.address}</p>
            <p><strong>Room Type:</strong>  ${
              booking.roomType.charAt(0).toUpperCase() +
              booking.roomType.slice(1).toLowerCase()
            }</p>
            <p><strong>Guests:</strong>  ${
              booking.numberOfGuests >= 5
                ? booking.numberOfGuests + "+"
                : booking.numberOfGuests
            }</p>
          </div>

          <div class="section">
            <div class="section-title">📅 Booking Dates</div>
            <p><strong>Check-in:</strong> ${booking.checkIn.toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toLocaleDateString()}</p>
            <p><strong>Nights:</strong> ${Math.ceil(
              (booking.checkOut.getTime() - booking.checkIn.getTime()) /
                (1000 * 60 * 60 * 24)
            )}</p>
          </div>

          <div class="section">
            <div class="section-title">💰 Payment Summary</div>
            <p><strong>Total Amount:</strong> Rs. ${booking.totalAmount}</p>
            <p><strong>Payment Method:</strong> You will pay when you check in at the hotel.</p>
          </div>

          <div class="important">
            ⚠️ Your booking is pending host approval. Once the host approves your
            reservation, you will not be able to cancel it. Please make sure your
            check-in and guest details are accurate.
          </div>

          <div class="section">
            <p>
              You will receive another email once your booking is approved or declined by the host.
            </p>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PeshawarStays. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `;

    await sendEmail(
      booking.customer.email,
      customerSubject,
      customerText,
      customerHtml
    );

    // sent email to owner
    const ownerSubject = "New Booking Request";
    const ownerText = `Hello ${
      booking.owner.firstName.charAt(0).toUpperCase() +
      booking.owner.firstName.slice(1).toLowerCase()
    },\n\n
You have a new booking request at PeshawarStays!
Property: ${booking.property.name}\n  
Location: ${booking.property.location}\n
Room Type: ${
      booking.roomType.charAt(0).toUpperCase() +
      booking.roomType.slice(1).toLowerCase()
    }\n
Guests: ${
      booking.numberOfGuests >= 5
        ? booking.numberOfGuests + "+"
        : booking.numberOfGuests
    }\n
Check-in: ${booking.checkIn.toLocaleDateString()}\n
Check-out: ${booking.checkOut.toLocaleDateString()}\n
Nights: ${Math.ceil(
      (booking.checkOut.getTime() - booking.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    )}\n
Total Amount: Rs. ${booking.totalAmount}\n
Customer: ${booking.customer.firstName} ${booking.customer.lastName}\n
Email: ${booking.customer.email}\n
Phone: ${booking.customer.phone}\n
Please review the booking request and take action as soon as possible.

Regards,
PeshawarStays
`;
    const ownerHtml = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>New Booking Request</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #e63946;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
          }
          .section {
            margin: 20px 0;
          }
          .section-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
          }
          .section p {
            margin: 5px 0;
          }
          .footer {
            text-align: center;
            font-size: 13px;
            color: #888;
            margin-top: 30px;
          }
          .important {
            background-color: #fff3cd;
            padding: 10px;
            border: 1px solid #ffeeba;
            border-radius: 5px;
            margin-top: 15px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Booking Request - PeshawarStays</h1>
          </div>

          <div class="section">
            <p>Hi <strong>${
              booking.owner.firstName.charAt(0).toUpperCase() +
              booking.owner.firstName.slice(1).toLowerCase()
            }</strong>,</p>
            <p>
              You have a new booking request at <strong>PeshawarStays</strong>!
            </p>
          </div>

          <div class="section">
            <div class="section-title">🏡 Property Details</div>
            <p><strong>Name:</strong> ${booking.property.name}</p>
            <p><strong>Location:</strong> ${booking.property.address}</p>
            <p><strong>Room Type:</strong>  ${
              booking.roomType.charAt(0).toUpperCase() +
              booking.roomType.slice(1).toLowerCase()
            }</p>
            <p><strong>Guests:</strong>  ${
              booking.numberOfGuests >= 5
                ? booking.numberOfGuests + "+"
                : booking.numberOfGuests
            }</p>
          </div>

          <div class="section">
            <div class="section-title">📅 Booking Dates</div>
            <p><strong>Check-in:</strong> ${booking.checkIn.toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toLocaleDateString()}</p>
            <p><strong>Nights:</strong> ${Math.ceil(
              (booking.checkOut.getTime() - booking.checkIn.getTime()) /
                (1000 * 60 * 60 * 24)
            )}</p>
          </div>

          <div class="section">
            <div class="section-title">💰 Payment Summary</div>
            <p><strong>Total Amount:</strong> Rs. ${booking.totalAmount}</p>
          </div>

          <div class="section"> 
            <div class="section-title">👤 Customer Details</div>
            <p><strong>Name:</strong> ${booking.customer.firstName} ${
      booking.customer.lastName
    }</p>
            <p><strong>Email:</strong> ${booking.customer.email}</p>
            <p><strong>Phone:</strong> ${booking.customer.phone}</p>
          </div>
          <div class="important">
            Please review the booking request and take action as soon as possible.
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PeshawarStays. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `;
    await sendEmail(booking.owner.email, ownerSubject, ownerText, ownerHtml);

    return NextResponse.json(
      { message: "Booking created successfully", booking: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
