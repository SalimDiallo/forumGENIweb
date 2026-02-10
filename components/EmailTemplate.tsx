import { Html, Body, Container, Text, Heading } from '@react-email/components';
import { render } from '@react-email/render';

interface ContactAdminEmailProps {
  nom: string;
  email: string;
}

function ContactAdminEmail({ nom, email }: ContactAdminEmailProps) {
  return (
    <Html>
      <Body style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#f4f4f7", padding: "32px 0", minHeight: "100vh" }}>
        <Container style={{
          maxWidth: 480,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
          padding: 32,
          border: "1px solid #eee",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img
              src="/logo-white.png"
              alt="Forum GENI INSEA"
              width={110}
              style={{
                display: "inline-block",
                marginBottom: 8,
                background: "#0d9488",
                padding: 8,
                borderRadius: 12,
              }}
            />
            <Heading as="h2" style={{
              color: "#0d9488",
              fontWeight: 700,
              letterSpacing: 1.2,
              fontSize: 22,
              margin: 0,
            }}>
              Nouveau message de contact
            </Heading>
          </div>
          <Text style={{ fontSize: 16, color: "#222", marginBottom: 24 }}>
            Bonjour, <br />
            <strong>{nom}</strong> ({email}) vient de vous envoyer un message via le formulaire de contact :
          </Text>
          <div
            style={{
              background: "#f1f5f9",
              padding: 16,
              borderRadius: 8,
              marginBottom: 24,
              border: "1px solid #e5e7eb",
              color: "#0f172a",
              fontSize: 15,
              whiteSpace: "pre-wrap",
            }}
          >
            {/* {message} */}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", textAlign: "center" }}>
            <hr style={{ margin: "24px 0", border: 0, borderTop: "1px solid #e5e7eb" }} />
            Ceci est un email automatique de <a href="https://www.forum-geni.ma" style={{ color: "#0d9488", textDecoration: "none" }}>Forum GENI × INSEA</a>.
          </div>
        </Container>
      </Body>
    </Html>
  );
}

// If you want to use @react-email/render to render the email template to HTML,
// you can export a helper like below (optional pattern, depending on usage):

export function renderContactAdminEmail(props: ContactAdminEmailProps) {
  return render(<ContactAdminEmail {...props} />);
}

export default ContactAdminEmail;