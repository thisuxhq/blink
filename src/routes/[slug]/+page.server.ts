import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import type { UrlsResponse } from "$lib/types";
import { hashPassword } from "$lib/utils/hash-password";
import { createInstance } from "../../lib/pocketbase";

const HASH_SECRET = env.HASH_SECRET || "your-fallback-secret-key";

export const load: PageServerLoad = async ({ params, locals }) => {
  console.log("Starting load function with params:", params);

  try {
    // Authenticate as admin
    await locals.pb.admins
      .authWithPassword(
        env.POCKETBASE_ADMIN_EMAIL!,
        env.POCKETBASE_ADMIN_PASSWORD!,
      )
      .catch((e) => {
        console.error("Failed to authenticate as admin:", e);
        throw error(500, "Failed to authenticate with PocketBase");
      });

    if (!params.slug) {
      console.log("No slug provided in params");
      throw error(400, "Slug is required");
    }

    if (params.slug.match(/\.(ico|png|jpg|jpeg|svg)$/i)) {
      return { isStaticAsset: true };
    }

    const url = await locals.pb
      .collection("urls")
      .getFirstListItem<UrlsResponse>(`slug = "${params.slug}"`)
      .catch(() => {
        console.log("URL not found for slug:", params.slug);
        return null;
      });

    if (!url) {
      throw error(404, "Not found");
    }
    console.log("Found URL:", url);

    // Increment clicks
    console.log("Incrementing clicks for URL ID:", url.id);
    await locals.pb.collection("urls").update(url.id, {
      clicks: url.clicks + 1,
    });

    // Check if the url is expired and redirect to expiration URL if needed
    if (url.expiration && new Date(url.expiration) < new Date()) {
      console.log("URL is expired. Expiration date:", url.expiration);
      if (url.expiration_url) {
        console.log("Redirecting to expiration URL:", url.expiration_url);
        throw redirect(302, url.expiration_url);
      }
      throw error(410, "This link has expired");
    }

    // If URL has password
    if (url.password_hash) {
      console.log("URL is password protected");
      return {
        isProtected: true,
        url_id: url.id,
      };
    }

    // If URL has meta data, return for brief display
    if (url.meta_title || url.meta_description || url.meta_image_url) {
      console.log("URL has meta data, returning meta information");
      return {
        meta: {
          title: url.meta_title,
          description: url.meta_description || "not working",
          image: url.meta_image_url,
          url: url.url,
        },
      };
    }

    // No meta or password - direct redirect
    console.log("Redirecting to URL:", url.url);
    throw redirect(302, url.url);
  } catch (e) {
    console.error("Error in load function:", e);
    throw error(500, "Failed to load URL");
  }
};

export const actions: Actions = {
  verify_password: async ({ request }) => {
    const pb = createInstance(env.PUBLIC_POCKETBASE_URL!);
    const authdata = await pb.admins.authWithPassword(
      env.POCKETBASE_ADMIN_EMAIL!,
      env.POCKETBASE_ADMIN_PASSWORD!,
    );

    if (!authdata.record) {
      throw error(401, "Unauthorized");
    }

    // Get form data from request
    const formData = await request.formData();
    const url_id = formData.get("url_id") as string;
    const password = formData.get("password") as string;

    console.log("Received URL ID:", url_id, "and password:", password);

    // Validate required fields
    if (!password || !url_id) {
      console.error("Missing required field: password or URL ID");
      return fail(400, { message: "Password or URL ID is required" });
    }

    // Create hash from password for comparison
    const hashedPassword = await hashPassword(password, HASH_SECRET);
    console.log("Hashed password for comparison:", hashedPassword);

    // Get URL from database
    const url = await pb.collection("urls").getOne(url_id);
    console.log("Fetched URL:", url);

    // Verify URL exists
    if (!url) {
      console.error("URL not found for ID:", url_id);
      return fail(404, { message: "URL not found" });
    }

    // Verify password hash matches
    if (url.password_hash !== hashedPassword) {
      console.error("Password hash does not match for URL ID:", url_id);

      return fail(401, { message: "Invalid password" });
    }

    // Redirect to target URL after successful verification
    console.log("Redirecting to URL:", url.url);
    throw redirect(302, url.url);
  },
};
