"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
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
  tools
}: Props) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, gap: 2 }}>
        {/* left section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Image src={logo} alt={company} width={88} height={88} />
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "#5CA5A5", fontWeight: 600 }}>
              {company}
            </Typography>

            {newJob && (
              <Typography
                sx={{
                  backgroundColor: "#5CA5A5",
                  color: "white",
                  borderRadius: "15px",
                  px: 1.5,
                  py: 0.5,
                  fontWeight: 600,
                  fontSize: 12
                }}
              >
                NEW!
              </Typography>
            )}

            {featured && (
              <Typography
                sx={{
                  backgroundColor: "#2C3A3A",
                  color: "white",
                  borderRadius: "15px",
                  px: 1.5,
                  py: 0.5,
                  fontWeight: 600,
                  fontSize: 12
                }}
              >
                FEATURED
              </Typography>
            )}
          </Box>

          <Typography sx={{ fontWeight: 700 }}>{position}</Typography>

          <Box sx={{ display: "flex", gap: 2, color: "#7C8F8F", fontSize: 14 }}>
            <span>{postedAt}</span>
            <span>• {contract}</span>
            <span>• {role} · {level}</span>
          </Box>
        </Box>
      </Box>

      {/* right sections */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignContent: "center" }}>
        {[...languages, ...tools].map((tag) => (
          <Box
            key={tag}
            sx={{
              backgroundColor: "rgba(92,165,165,0.1)",
              color: "#5CA5A5",
              fontWeight: 600,
              borderRadius: "6px",
              px: 1,
              py: 0.5,
              fontSize: 12
            }}
          >
            {tag}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default JobListing;