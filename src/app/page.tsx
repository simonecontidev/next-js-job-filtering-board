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
  Autocomplete,
  Chip,
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
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

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
  const tagOptions = React.useMemo(() => {
    const tags = new Set<string>();
    data.forEach((d) => {
      d.languages.forEach((l) => tags.add(l));
      d.tools.forEach((t) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, []);

  // -------- Filtro principale
  const filtered: Job[] = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    return data.filter((job) => {
      if (onlyNew && !job.new) return false;
      if (onlyFeatured && !job.featured) return false;
      if (role && job.role !== role) return false;
      if (level && job.level !== level) return false;
      if (contract && job.contract !== contract) return false;

      // filtro per tag
      if (selectedTags.length > 0) {
        const jobTags = new Set([...job.languages, ...job.tools]);
        const allIncluded = selectedTags.every((t) => jobTags.has(t));
        if (!allIncluded) return false;
      }

      // filtro testuale
      if (q) {
        const haystack = `${job.company} ${job.position} ${job.role} ${job.level}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [search, onlyNew, onlyFeatured, role, level, contract, selectedTags]);

  // -------- Reset rapido
  const handleReset = () => {
    setSearch("");
    setOnlyNew(false);
    setOnlyFeatured(false);
    setRole("");
    setLevel("");
    setContract("");
    setSelectedTags([]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: 800,
          textAlign: "center",
          color: "#2C3A3A",
          mb: 3,
          letterSpacing: "-0.5px",
        }}
      >
        Job Filtering Board
      </Typography>

      {/* ------------------ FILTER BAR ------------------ */}
      <Paper
        elevation={3}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          p: 3,
          mb: 5,
          borderRadius: 3,
          backdropFilter: "saturate(1.2) blur(8px)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr 1fr" },
          }}
        >
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

          {/* Role / Level */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormControl size="small">
              <InputLabel>Role</InputLabel>
              <Select label="Role" value={role} onChange={(e) => setRole(String(e.target.value))}>
                <MenuItem value="">All</MenuItem>
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Level</InputLabel>
              <Select label="Level" value={level} onChange={(e) => setLevel(String(e.target.value))}>
                <MenuItem value="">All</MenuItem>
                {levels.map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Contract + Tags */}
          <Box sx={{ display: "grid", gap: 2 }}>
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

            <Autocomplete
              multiple
              size="small"
              options={tagOptions}
              value={selectedTags}
              onChange={(_, v) => setSelectedTags(v)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => <TextField {...params} label="Tags (languages & tools)" />}
            />
          </Box>
        </Box>

        {/* Reset */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#5CA5A5",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={handleReset}
          >
            Reset filters
          </Typography>
        </Box>
      </Paper>

      {/* ------------------ JOB LISTINGS ------------------ */}
      {filtered.map((job) => (
        <JobListing
          key={job.id}
          company={job.company}
          logo={job.logo}
          newJob={Boolean(job.new)}
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