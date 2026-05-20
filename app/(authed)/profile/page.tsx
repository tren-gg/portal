import { ScreenHead } from "@/components/screen-head";
import { ProfileForm } from "@/components/profile-form";
import { getMe } from "@/lib/api/me";

export default async function ProfilePage() {
  const me = await getMe();
  const handle = me.user.email.split("@")[0];

  return (
    <>
      <ScreenHead
        eyebrow="profile"
        title="How we<br/>reach you."
        lede="Display name is what the loader greets you with. Email is used for receipts, device authorization, and build releases."
      />

      <div className="screen-body">
        <ProfileForm
          email={me.user.email}
          initialHandle={handle}
          userId={me.user.id}
          createdAt={me.user.createdAt}
        />

        <div className="dark-block">
          <div className="group__l">
            <h2 className="group__title">Delete account</h2>
            <p className="group__caption">
              Closes your subscription, releases all seats, and wipes saved
              configs. Can&apos;t be undone after 14 days.
            </p>
          </div>
          <div
            className="group__r"
            style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
          >
            <button className="btn btn--ghost-dark" type="button">
              Begin deletion
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
