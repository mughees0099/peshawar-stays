import Booking from "@/models/Bookings";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Property from "@/models/property";
import { sendEmail } from "@/lib/mailer";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const customer = await Booking.find({ customer: slug });

    const host = await Booking.find({ owner: slug })
      .populate("customer", "firstName lastName email phone")
      .populate("property");

    if (!customer.length && !host.length) {
      return NextResponse.json(
        { error: "No bookings found for this slug" },
        { status: 404 }
      );
    }

    if (customer.length) {
      return NextResponse.json(customer, { status: 200 });
    }
    if (host.length) {
      return NextResponse.json(host, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = params;
    const body = await request.json();
    const { isApproved, status, property, roomType } = body;

    if (!status && !isApproved && !property && !roomType) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    if (isApproved === true) {
      const propertyDoc = await Property.findById(property);
      if (!propertyDoc) {
        return NextResponse.json(
          { error: "Property not found" },
          { status: 404 }
        );
      }

      const room = propertyDoc.roomDetails.find(
        (r: any) => r.type === roomType
      );
      if (!room) {
        return NextResponse.json(
          { error: "Room type not found in property" },
          { status: 404 }
        );
      }

      if (room.availableRooms <= 0) {
        return NextResponse.json(
          { error: "No available rooms left for this type" },
          { status: 409 }
        );
      }

      room.availableRooms -= 1;

      await propertyDoc.save();
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      slug,
      { status, isApproved },
      { new: true }
    )
      .populate("customer")
      .populate("owner")
      .populate("property");

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const customerSubject = `Your Booking at ${
      updatedBooking.property.name
    } is ${isApproved ? "Confirmed" : "Cancelled"}!`;

    const customerText = isApproved
      ? `Hello ${updatedBooking.customer.firstName},\n\n

Good news! Your booking at ${
          updatedBooking.property.name
        } from ${updatedBooking.checkIn.toLocaleDateString()} to ${updatedBooking.checkOut.toLocaleDateString()} has been approved by the host.\n\n
Here are your booking details:

Total Guests: ${updatedBooking.numberOfGuests}
Total Amount: Rs. ${updatedBooking.totalAmount}
Payment Method: Pay on Check-In

Your reservation is now confirmed. Please check in on time and present this confirmation.

Thanks for using PeshawarStays!
`
      : `Hi ${updatedBooking.customer.firstName},\n\n

Unfortunately, your booking request for ${
          updatedBooking.property.name
        } from ${updatedBooking.checkIn.toLocaleDateString()} to ${updatedBooking.checkOut.toLocaleDateString()} has been declined by the host.

You can explore and book other listings at PeshawarStays.

Thanks for your understanding.
`;

    const customerHtml = isApproved
      ? `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Booking Confirmed</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f2f4f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .header {
      background-color: #38b000;
      color: #fff;
      padding: 20px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .section-title {
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 13px;
      color: #999;
    }
    .info-box {
      background: #eafbea;
      padding: 15px;
      border-left: 4px solid #38b000;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Your Booking is Confirmed! 🎉</h2>
    </div>
    <div class="content">
      <p>Hi <strong>${updatedBooking.customer.firstName}</strong>,</p>
      <p>Your booking at <strong> ${
        updatedBooking.property.name
      }</strong> has been <strong>approved</strong> by the host.</p>
      

      <p class="section-title">📅 Booking Details:</p>
      <ul>
        <li><strong>Check-in:</strong> ${updatedBooking.checkIn.toLocaleDateString()}</li>
        <li><strong>Check-out:</strong> ${updatedBooking.checkOut.toLocaleDateString()}</li>
        <li><strong>Total Guests:</strong> ${updatedBooking.numberOfGuests}</li>
      </ul>

      <p class="section-title">💰 Payment Info:</p>
      <ul>
        <li><strong>Total:</strong> Rs. ${updatedBooking.totalAmount}</li>
        <li><strong>Payment Method:</strong> Pay on Check-In</li>
      </ul>

      <div class="info-box">
        ✅ Your booking is now confirmed. After host approval, you cannot cancel this reservation. Please arrive on time and present this confirmation email at check-in.
      </div>

      <p>Thanks for using <strong>PeshawarStays</strong>! 🏡</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} PeshawarStays. All rights reserved.
    </div>
  </div>
</body>
</html>
`
      : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Booking Declined</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .header {
      background-color: #d90429;
      color: #fff;
      padding: 20px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 13px;
      color: #999;
    }
    .alert-box {
      background: #fff3f3;
      padding: 15px;
      border-left: 4px solid #d90429;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Booking Declined</h2>
    </div>
    <div class="content">
      <p>Hi <strong>${updatedBooking.customer.firstName}</strong>,</p>
      <p>We regret to inform you that your booking request for <strong>${
        updatedBooking.property.name
      }</strong> has been declined by the host.</p>

      <ul>
         <li><strong>Check-in:</strong> ${updatedBooking.checkIn.toLocaleDateString()}</li>
        <li><strong>Check-out:</strong> ${updatedBooking.checkOut.toLocaleDateString()}</li>
      </ul>

      <div class="alert-box">
        ❌ Don't worry — you haven’t been charged. You can browse other amazing listings and book again!
      </div>

      <p>We appreciate your interest in <strong>PeshawarStays</strong> and hope to serve you again soon!</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} PeshawarStays. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

    const hostSubject = `You have ${
      isApproved ? "approved" : "declined"
    } a booking for ${updatedBooking.property.name}
`;
    const hostText = `Hi ${updatedBooking.owner.firstName},

You have successfully ${
      isApproved ? "approved" : "declined"
    } a booking request at your property "${updatedBooking.property.name}".

Booking Details:
- Guest: ${updatedBooking.customer.firstName}
- Check-in: ${updatedBooking.checkIn.toLocaleDateString()}
- Check-out: ${updatedBooking.checkOut.toLocaleDateString()}
- Total Guests: ${updatedBooking.numberOfGuests}
- Total Amount: Rs. ${updatedBooking.totalAmount}

${
  isApproved
    ? "The guest will pay on check-in. Be ready to welcome them!"
    : "The guest has been notified about the declined booking."
}

Thanks,
PeshawarStays Team
`;

    const hostHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Booking Status Updated</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f2f4f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .header {
      background-color: ${isApproved ? "#007f5f" : "#d90429"};
      color: #fff;
      padding: 20px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .section-title {
      font-weight: bold;
      margin-top: 20px;
    }
    .info-box {
      background: ${isApproved ? "#eafbea" : "#fff3f3"};
      padding: 15px;
      border-left: 4px solid ${isApproved ? "#38b000" : "#d90429"};
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 13px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Booking ${isApproved ? "Approved" : "Declined"}</h2>
    </div>
    <div class="content">
      <p>Hi <strong>${updatedBooking.owner.firstName}</strong>,</p>

      <p>You have <strong>${
        isApproved ? "approved" : "declined"
      }</strong> a booking request at your property "<strong>${
      updatedBooking.property.name
    }</strong>".</p>

      <p class="section-title">👤 Guest Information:</p>
      <ul>
        <li><strong>Name:</strong> ${updatedBooking.customer.firstName}</li>
        <li><strong>Email:</strong> ${updatedBooking.customer.email}</li>
      </ul>

      <p class="section-title">📅 Booking Details:</p>
      <ul>
        <li><strong>Check-in:</strong> ${updatedBooking.checkIn.toLocaleDateString()}</li>
        <li><strong>Check-out:</strong> ${updatedBooking.checkOut.toLocaleDateString()}</li>
        <li><strong>Total Guests:</strong> ${updatedBooking.numberOfGuests}</li>
        <li><strong>Total Amount:</strong> Rs. ${
          updatedBooking.totalAmount
        }</li>
      </ul>

      <div class="info-box">
        ${
          isApproved
            ? "✅ The guest has been notified. Expect payment on check-in day."
            : "❌ The guest has been notified about the decline. No further action is required."
        }
      </div>

      <p>Thank you for hosting with <strong>PeshawarStays</strong>! 🏡</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} PeshawarStays. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

    // Send email to customer
    await sendEmail(
      updatedBooking.customer.email,
      customerSubject,
      customerText,
      customerHtml
    );

    // Send email to host
    await sendEmail(
      updatedBooking.owner.email,
      hostSubject,
      hostText,
      hostHtml
    );

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = params;

    const deletedBooking = await Booking.findByIdAndDelete(slug);
    if (!deletedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
