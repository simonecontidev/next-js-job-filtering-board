"use client";

import * as React from "react";
import {
  Typography,
  Container,
  Paper,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import data from "../data/data.json";
import JobListing from "../components/JobListing";

type Job = typeof data[number];

export default function Home() {
  // -------- Stato filtri
  const [search, setSearch] = React.useState("");
  const [onlyNew, setOnlyNew] = React.useState(false);
  const [onlyFeatured, setOnlyFeatured] = React.useState(false);
  const [role, setRole] = React.useState<string | "">("");
  const [level, setLevel] = React.useState<string | "">("");
  const [contract, setContract] = React.useState<string | "">("");

  // -------- Opzioni derivate dai dati
  const roles = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.role))).sort(),
    []
  );
  const levels = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.level))).sort(),
    []
  );
  const contracts = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.contract))).sort(),
    []
  );

  // -------- Filtro
  const filtered: Job[] = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    return data.filter((job) => {
      if (onlyNew && !job.new) return false;
      if (onlyFeatured && !job.featured) return false;
      if (role && job.role !== role) return false;
      if (level && job.level !== level) return false;
      if (contract && job.contract !== contract) return false;

      if (q) {
        const haystack = `${job.company} ${job.position} ${job.role} ${job.level}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [search, onlyNew, onlyFeatured, role, level, contract]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: 800, textAlign: "center", color: "#2C3A3A", mb: 3, letterSpacing: "-0.5px" }}
      >
        Job Filtering Board
      </Typography>

      {/* Filter bar semplice */}
      <Paper
        elevation={3}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          p: 2,
          mb: 4,
          borderRadius: 3,
          backdropFilter: "saturate(1.2) blur(8px)",
        }}
      >
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr 1fr" } }}>
          {/* Search + toggles */}
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <TextField
              label="Search by company or position"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControlLabel
                control={<Switch checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} />}
                label="NEW"
              />
              <FormControlLabel
                control={<Switch checked={onlyFeatured} onChange={(e) => setOnlyFeatured(e.target.checked)} />}
                label="FEATURED"
              />
            </Box>
          </Box>

          {/* Role */}
          <FormControl size="small">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(String(e.target.value))}
            >
              <MenuItem value="">All</MenuItem>
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Level / Contract in colonna su mobile */}
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <FormControl size="small">
              <InputLabel>Level</InputLabel>
              <Select
                label="Level"
                value={level}
                onChange={(e) => setLevel(String(e.target.value))}
              >
                <MenuItem value="">All</MenuItem>
                {levels.map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Contract</InputLabel>
              <Select
                label="Contract"
                value={contract}
                onChange={(e) => setContract(String(e.target.value))}
              >
                <MenuItem value="">All</MenuItem>
                {contracts.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Lista filtrata */}
      {filtered.map((job) => (
        <JobListing
          key={job.id}
          company={job.company}
          logo={job.logo}
          newJob={job.new}
          featured={job.featured}
          position={job.position}
          role={job.role}
          level={job.level}
          postedAt={job.postedAt}
          contract={job.contract}
          languages={job.languages}
          tools={job.tools}
        />
      ))}

      {filtered.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "#7C8F8F", mt: 6 }}>
          No results. Try adjusting the filters.
        </Typography>
      )}
    </Container>
  );
}