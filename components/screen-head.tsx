type ScreenHeadProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  cta?: React.ReactNode;
};

export function ScreenHead({ eyebrow, title, lede, cta }: ScreenHeadProps) {
  return (
    <div className="screen-head">
      <div className="screen-head__l">
        <span className="screen-head__eyebrow">{eyebrow}</span>
        <h1
          className="screen-head__title"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <div className="screen-head__r">
        {cta ? (
          <div className="head-cta">
            {lede ? <p>{lede}</p> : null}
            {cta}
          </div>
        ) : lede ? (
          <p>{lede}</p>
        ) : null}
      </div>
    </div>
  );
}
