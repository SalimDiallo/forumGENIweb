import EmailTemplate from '@/components/EmailTemplate';
import { env } from '@/lib/env';
import { Resend } from 'resend';
import { z } from 'zod';


const contactSchema = z.object({
  nom: z.string().min(1),
  email: z.email(),
});

type ContactData = z.infer<typeof contactSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    const { nom, email } = result.data;

   

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}