export type PortfolioStockCardProps = {
  symbol: string;
  name: string;
  price: number;
  changeLabel: string;
};

function changeClassName(changeLabel: string): string {
  const t = changeLabel.trim();
  if (t.startsWith("-")) return "negative";
  if (t.startsWith("+")) return "positive";
  return "";
}

export function PortfolioStockCard({
  symbol,
  name,
  price,
  changeLabel,
}: PortfolioStockCardProps) {
  const tone = changeClassName(changeLabel);
  return (
    <div className="stock-long">
      <div className="stock-topic">
        <h2>{symbol}</h2>
        <p>{name}</p>
      </div>
      <div className="stock-topic">
        <h2>${price.toFixed(2)}</h2>
        <p className={tone ? `stock-topic-change ${tone}` : "stock-topic-change"}>
          {changeLabel}
        </p>
      </div>
    </div>
  );
}
