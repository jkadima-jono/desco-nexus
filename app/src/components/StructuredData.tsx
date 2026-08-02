type StructuredDataValue = Record<string, unknown> | Record<string, unknown>[];

function safeJson(value: StructuredDataValue) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
export default function StructuredData({ data }: { data: StructuredDataValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}
