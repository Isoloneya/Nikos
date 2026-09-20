import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Niko's <onboarding@resend.dev>";

export async function sendBookingConfirmation(booking: {
  email: string;
  name: string;
  date: Date;
  time: string;
  guests: number;
  restaurantCity: string;
  restaurantAddress: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: booking.email,
    subject: "Niko's — бронювання підтверджено",
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2>Дякуємо, ${booking.name}!</h2>
        <p>Ваш столик заброньовано:</p>
        <ul>
          <li>Локація: ${booking.restaurantCity}, ${booking.restaurantAddress}</li>
          <li>Дата: ${booking.date.toLocaleDateString("uk-UA")}</li>
          <li>Час: ${booking.time}</li>
          <li>Гостей: ${booking.guests}</li>
        </ul>
        <p>До зустрічі в Niko's!</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmation(order: {
  email: string;
  contactName: string;
  orderId: string;
  totalCents: number;
  type: string;
  items: { name: string; quantity: number }[];
}) {
  const itemsHtml = order.items.map((i) => `<li>${i.quantity} × ${i.name}</li>`).join("");

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Niko's — замовлення ${order.orderId.slice(0, 8)} прийнято`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2>Дякуємо за замовлення, ${order.contactName}!</h2>
        <p>${order.type === "DELIVERY" ? "Доставимо якнайшвидше." : "Чекаємо на самовивіз."}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Разом: ${(order.totalCents / 100).toFixed(0)} ₴</strong></p>
      </div>
    `,
  });
}