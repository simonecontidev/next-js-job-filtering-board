"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import Image from "next/image";

interface Props {
  company: string;
  logo: string;
  newJob: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  languages: string[];
  tools: string[];
}

const JobListing = ({
  company,
  logo,
  newJob,
  featured,
  position,
  role,
  level,
  postedAt,
  contract,
  languages,
  tools,
}: Props) => {
  return (
    <Paper
      elevation={featured ? 6 : 2}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
        p: 3,
        mb: 3,
        borderRadius: "16px",
        borderLeft: featured ? "6px solid #5CA5A5" : "6px solid transparent",
        backgroundColor: "#fff",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* LEFT: logo + info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Image
          src={logo}
          alt={company}
          width={80}
          height={80}
          style={{
            borderRadius: "12px",
            objectFit: "contain",
            backgroundColor: "#F5FAFA",
            padding: "8px",
          }}
        />

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                color: "#5CA5A5",
                fontWeight: 700,
                letterSpacing: 0.3,
                textTransform: "uppercase",
                fontSize: 14,
              }}
            >
              {company}
            </Typography>

            {newJob && (
              <Box
                sx={{
                  backgroundColor: "#5CA5A5",
                  color: "white",
                  borderRadius: "999px",
                  px: 1.2,
                  py: 0.3,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: 0.5,
                }}
              >
                NEW!
              </Box>
            )}

            {featured && (
              <Box
                sx={{
                  backgroundColor: "#2C3A3A",
                  color: "white",
                  borderRadius: "999px",
                  px: 1.2,
                  py: 0.3,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: 0.5,
                }}
              >
                FEATURED
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 18,
              mt: 0.6,
              color: "#2C3A3A",
              cursor: "pointer",
              "&:hover": { color: "#5CA5A5" },
            }}
          >
            {position}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              color: "#7C8F8F",
              fontSize: 13,
              mt: 0.4,
            }}
          >
            <span>{postedAt}</span>•<span>{contract}</span>•
            <span>
              {role} · {level}
            </span>
          </Box>
        </Box>
      </Box>

      {/* RIGHT: skill tags */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "flex-end",
        }}
      >
        {[...languages, ...tools].map((tag) => (
          <Box
            key={tag}
            sx={{
              backgroundColor: "rgba(92,165,165,0.12)",
              color: "#5CA5A5",
              fontWeight: 600,
              borderRadius: "6px",
              px: 1.5,
              py: 0.7,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#5CA5A5",
                color: "white",
              },
            }}
          >
            {tag}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default JobListing;