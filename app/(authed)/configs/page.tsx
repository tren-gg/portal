import { ScreenHead } from "@/components/screen-head";
import { ConfigsList } from "@/components/configs-list";
import { deleteSavedConfig, getSavedConfig, getSavedConfigs } from "@/lib/api/account";
import { getApiErrorMessage } from "@/lib/api/client";
import type { SavedConfigDetails } from "@/lib/api/types";
import { redirect } from "next/navigation";

async function deleteConfigAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/configs?error=Saved+config+is+required.");
  }

  try {
    await deleteSavedConfig(id);
  } catch (error) {
    redirect(`/configs?error=${encodeURIComponent(getApiErrorMessage(error))}`);
  }

  redirect("/configs?status=Saved+config+deleted.");
}

export default async function ConfigsPage({
  searchParams,
}: {
  searchParams: Promise<{ selected?: string; error?: string; status?: string }>;
}) {
  const params = await searchParams;
  const configs = await getSavedConfigs();
  let selectedConfig: SavedConfigDetails | null = null;
  let selectedError: string | undefined;

  if (params.selected) {
    try {
      selectedConfig = await getSavedConfig(params.selected);
    } catch (error) {
      selectedError = getApiErrorMessage(error, "Saved config could not be loaded.");
    }
  }

  return (
    <>
      <ScreenHead
        eyebrow="configs"
        title="Synced from<br/>the loader."
        lede="Saved configs come from the API now. The portal lists what the loader has actually synced to your account."
      />

      <div className="screen-body">
        <ConfigsList
          configs={configs}
          selectedConfig={selectedConfig}
          deleteAction={deleteConfigAction}
          error={params.error ?? selectedError}
          status={params.status}
        />
      </div>
    </>
  );
}
