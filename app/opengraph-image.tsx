import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "McCain Foods | Celebrating Real Connections";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #006341 0%, #004d32 40%, #003825 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 199, 44, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-60px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.04)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Logo text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "rgba(255, 199, 44, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "#FFC72C",
                }}
              >
                M
              </div>
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-1px",
              }}
            >
              McCain Foods
            </div>
          </div>

          {/* Yellow divider */}
          <div
            style={{
              width: "80px",
              height: "4px",
              borderRadius: "2px",
              background: "#FFC72C",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              color: "rgba(255, 255, 255, 0.85)",
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            Celebrating Real Connections
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.5)",
              maxWidth: "600px",
              textAlign: "center",
              lineHeight: "1.5",
            }}
          >
            Global leader in prepared potato products and appetizers
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "linear-gradient(90deg, #FFC72C 0%, #006341 50%, #FFC72C 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
