import { ScreenHead } from "@/components/screen-head";
import { ConfigsList } from "@/components/configs-list";
import { getMe } from "@/lib/api/me";

export default async function ConfigsPage() {
  const me = await getMe();

  return (
    <>
      <ScreenHead
        eyebrow="configs"
        title="Synced from<br/>the loader."
        lede="Saved configs upload encrypted from the Windows client. They never leave your account, and the loader can pull any of them on next launch."
      />

      <div className="screen-body">
        <ConfigsList configs={me.account.savedConfigs} />
      </div>
    </>
  );
}
