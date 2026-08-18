import { Check, Palette, Sparkles } from "lucide-react";
import { purchaseCollectionItem, collectionValueBalance } from "../../../shared/fragmentSystem";
import type { AppConfig, CollectionShopItem, CosmeticBackgroundId, CosmeticThemeId, ProfileState } from "../../../shared/study";

type Props = { config: AppConfig; profile: ProfileState; onProfile: (profile: ProfileState, message?: string) => void };

function isOwned(profile: ProfileState, item: CollectionShopItem) {
  return item.price === 0 || (profile.collectionInventory ?? []).includes(item.id);
}

export default function CosmeticShop({ config, profile, onProfile }: Props) {
  const items = (config.collectionConfig?.shopItems ?? []).filter((item) => item.enabled && !item.deletedAt && item.cosmeticType);
  const theme = profile.activeCosmeticTheme ?? "ong-red";
  const background = profile.activeCosmeticBackground ?? "paper-grid";
  const apply = (item: CollectionShopItem) => {
    if (!item.cosmeticType || !item.cosmeticId || !isOwned(profile, item)) return;
    const next = item.cosmeticType === "theme"
      ? { ...profile, activeCosmeticTheme: item.cosmeticId as CosmeticThemeId }
      : { ...profile, activeCosmeticBackground: item.cosmeticId as CosmeticBackgroundId };
    onProfile(next, `Đã áp dụng ${item.name}.`);
  };
  const buy = (item: CollectionShopItem) => {
    if (isOwned(profile, item)) return apply(item);
    const result = purchaseCollectionItem(config, profile, item);
    if (result.purchased) onProfile(result.profile, `Đã nhận ${item.name}. Nhấn “Áp dụng” để dùng ngay.`);
  };
  return <section className="panel mt-7 p-6" aria-labelledby="cosmetic-shop-title">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-green-700 dark:text-green-300">Cửa hàng giao diện</p><h2 id="cosmetic-shop-title" className="mt-2 font-display text-2xl font-bold">🎨 Theme màu & nền animation</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Mỗi vật phẩm có giá và công dụng rõ ràng. Mua bằng Vé Sưu Tầm hoặc điểm mảnh; sở hữu xong có thể áp dụng lại bất kỳ lúc nào.</p></div><span className="rounded-full bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900 dark:bg-amber-500/15 dark:text-amber-100">{collectionValueBalance(config, profile)} điểm mảnh · {profile.collectionTickets ?? 0} vé</span></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{items.map((item) => { const owned = isOwned(profile, item); const active = item.cosmeticType === "theme" ? item.cosmeticId === theme : item.cosmeticId === background; const canBuy = item.currency === "collectionTicket" ? (profile.collectionTickets ?? 0) >= item.price : collectionValueBalance(config, profile) >= item.price; return <article key={item.id} className={`cosmetic-card ${item.previewClass ?? ""} ${active ? "cosmetic-card--active" : ""}`}><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 text-slate-700 shadow-sm dark:bg-black/20 dark:text-white">{item.cosmeticType === "theme" ? <Palette className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}</span><span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold uppercase dark:bg-black/20">{item.rarity}</span></div><h3 className="mt-4 font-display text-lg font-bold">{item.name}</h3><p className="mt-1 min-h-12 text-sm leading-5 text-slate-600 dark:text-slate-200">{item.description}</p><p className="mt-3 text-xs font-bold">{item.price === 0 ? "Miễn phí" : `${item.price} ${item.currency === "collectionTicket" ? "Vé Sưu Tầm" : "điểm mảnh"}`}</p><button className={`${active ? "secondary-button" : "primary-button"} mt-3 w-full justify-center px-3 py-2 text-xs`} disabled={active || (!owned && !canBuy)} onClick={() => buy(item)}>{active ? <><Check className="h-3.5 w-3.5" />Đang áp dụng</> : owned ? "Áp dụng" : canBuy ? "Đổi vật phẩm" : "Chưa đủ tiền"}</button></article>; })}</div>
  </section>;
}
