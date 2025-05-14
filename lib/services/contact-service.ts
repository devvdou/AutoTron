import { supabase } from "../supabase";

/**
 * Interface for contact form data
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Interface for newsletter subscription data
 */
export interface NewsletterData {
  email: string;
  interests?: string[]; // Assuming interests are stored as an array of strings
}

/**
 * Service for contact-related operations using Supabase
 */
export const ContactService = {
  /**
   * Submit contact form to 'contact_submissions' table
   * @param formData Contact form data
   * @returns Promise with success status and message
   */
  submitContactForm: async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
    // Basic client-side validation (can be enhanced)
    if (!formData.name || !formData.email || !formData.message) {
      return {
        success: false,
        message: "Por favor complete todos los campos requeridos (nombre, email, mensaje).",
      };
    }

    const emailRegex = /^[^s@]+@[^s@]+\.[^s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Por favor ingrese un correo electrónico válido.",
      };
    }

    try {
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          // submitted_at will be set by default value in DB or trigger
        },
      ]);

      if (error) {
        console.error("Error submitting contact form:", error.message);
        return {
          success: false,
          message: "Hubo un error al enviar su mensaje. Por favor, inténtelo de nuevo más tarde.",
        };
      }

      return {
        success: true,
        message: "¡Gracias por contactarnos! Hemos recibido su mensaje y nos pondremos en contacto pronto.",
      };
    } catch (err) {
      console.error("Unexpected error in submitContactForm:", err);
      return {
        success: false,
        message: "Ocurrió un error inesperado. Por favor, inténtelo de nuevo.",
      };
    }
  },

  /**
   * Subscribe to newsletter in 'newsletter_subscriptions' table
   * @param newsletterData Newsletter subscription data
   * @returns Promise with success status and message
   */
  subscribeToNewsletter: async (newsletterData: NewsletterData): Promise<{ success: boolean; message: string }> => {
    if (!newsletterData.email) {
      return {
        success: false,
        message: "Por favor ingrese su correo electrónico.",
      };
    }

    const emailRegex = /^[^s@]+@[^s@]+\.[^s@]+$/;
    if (!emailRegex.test(newsletterData.email)) {
      return {
        success: false,
        message: "Por favor ingrese un correo electrónico válido.",
      };
    }

    try {
      // Check if email already exists
      const { data: existingSubscription, error: fetchError } = await supabase
        .from("newsletter_subscriptions")
        .select("email")
        .eq("email", newsletterData.email)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: 'Searched for a single row, but found no rows'
        console.error("Error checking newsletter subscription:", fetchError.message);
        return {
          success: false,
          message: "Hubo un error al procesar su suscripción. Inténtelo de nuevo.",
        };
      }

      if (existingSubscription) {
        return {
          success: false,
          message: "Este correo electrónico ya está suscrito a nuestro boletín.",
        };
      }

      const { error: insertError } = await supabase.from("newsletter_subscriptions").insert([
        {
          email: newsletterData.email,
          interests: newsletterData.interests,
          // subscribed_at will be set by default value in DB or trigger
        },
      ]);

      if (insertError) {
        console.error("Error subscribing to newsletter:", insertError.message);
        return {
          success: false,
          message: "Hubo un error al suscribirse al boletín. Por favor, inténtelo de nuevo más tarde.",
        };
      }

      return {
        success: true,
        message: "¡Gracias por suscribirse! Pronto recibirá noticias nuestras.",
      };
    } catch (err) {
      console.error("Unexpected error in subscribeToNewsletter:", err);
      return {
        success: false,
        message: "Ocurrió un error inesperado al procesar su suscripción.",
      };
    }
  },
};

export default ContactService;
