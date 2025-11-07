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
import { useFilters, DEFAULTS, SortKey } from "@/state/useFilters";

type Job = typeof data[number];

export default function Home() {
  // -------- Stato filtri (persistente URL + localStorage)
  const { filters, setFilters } = useFilters();

  // Adapter per mantenere la TUA API identica (niente tocchi nel JSX)
  const {
    search,
    onlyNew,
    onlyFeatured,
    role,
    level,
    contract,
    selectedTags,
    sortBy,
  } = filters;

  const setSearch = (v: string) =>
    setFilters((s) => ({ ...s, search: v }));

  const setOnlyNew = (v: boolean) =>
    setFilters((s) => ({ ...s, onlyNew: v }));

  const setOnlyFeatured = (v: boolean) =>
    setFilters((s) => ({ ...s, onlyFeatured: v }));

  const setRole = (v: string | "") =>
    setFilters((s) => ({ ...s, role: v }));

  const setLevel = (v: string | "") =>
    setFilters((s) => ({ ...s, level: v }));

  const setContract = (v: string | "") =>
    setFilters((s) => ({ ...s, contract: v }));

  const setSelectedTags = (v: string[]) =>
    setFilters((s) => ({ ...s, selectedTags: v }));

  const setSortBy = (v: SortKey) =>
    setFilters((s) => ({ ...s, sortBy: v }));

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

  // -------- Filtro + Ordinamento
  const filtered: Job[] = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    const out = data.filter((job) => {
      if (onlyNew && !job.new) return false;
      if (onlyFeatured && !job.featured) return false;
      if (role && job.role !== role) return false;
      if (level && job.level !== level) return false;
      if (contract && job.contract !== contract) return false;

      if (selectedTags.length > 0) {
        const jobTags = new Set([...job.languages, ...job.tools]);
        const allIncluded = selectedTags.every((t) => jobTags.has(t));
        if (!allIncluded) return false;
      }

      if (q) {
        const haystack = `${job.company} ${job.position} ${job.role} ${job.level}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    // Ordinamento
    if (sortBy === "company") return out.slice().sort((a, b) => a.company.localeCompare(b.company));
    if (sortBy === "role") return out.slice().sort((a, b) => a.role.localeCompare(b.role));
    if (sortBy === "level") return out.slice().sort((a, b) => a.level.localeCompare(b.level));
    // "recent" mantiene l'ordine del JSON
    return out;
  }, [search, onlyNew, onlyFeatured, role, level, contract, selectedTags, sortBy]);

  // -------- Reset rapido
  const handleReset = () => setFilters({ ...DEFAULTS });

  // -------- Click su tag dalla card → aggiunge ai filtri
  const handleTagClick = (tag: string) =>
    setSelectedTags(selectedTags.includes(tag) ? selectedTags : [...selectedTags, tag]);

  // -------- Copy share link (senza cambiare il design)
  const [copied, setCopied] = React.useState(false);
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: seleziona e copia
      const tmp = document.createElement("input");
      tmp.value = window.location.href;
      document.body.appendChild(tmp);
      tmp.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } finally {
        document.body.removeChild(tmp);
      }
    }
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
          mb: 1.5,
          letterSpacing: "-0.5px",
        }}
      >
        Job Filtering Board
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: "#7C8F8F", mb: 3 }}>
        {filtered.length} result{filtered.length === 1 ? "" : "s"}
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

          {/* Contract + Sort + Tags */}
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
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

              {/* SORT */}
              <FormControl size="small">
                <InputLabel>Sort</InputLabel>
                <Select
                  label="Sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                >
                  <MenuItem value="recent">Newest</MenuItem>
                  <MenuItem value="company">Company A–Z</MenuItem>
                  <MenuItem value="role">Role A–Z</MenuItem>
                  <MenuItem value="level">Level A–Z</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* TAGS */}
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

        {/* Reset + Copy link (stessa riga, stesso stile) */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 3, alignItems: "center" }}>
          <Typography
            variant="body2"
            role="button"
            aria-label="Copy share link"
            title="Copy share link"
            sx={{
              color: "#5CA5A5",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
              userSelect: "none",
            }}
            onClick={copyShareLink}
          >
            {copied ? "Copied!" : "Copy share link"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#5CA5A5",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
              userSelect: "none",
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
          onTagClick={handleTagClick as any}
        />
      ))}

      {/* ------------------ EMPTY STATE ------------------ */}
      {filtered.length === 0 && (
        <Paper
          variant="outlined"
          sx={{ textAlign: "center", py: 6, borderRadius: 3, color: "#7C8F8F" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#2C3A3A" }}>
            No results found
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Try changing role, level, or add/remove tags.
          </Typography>
          <Box
            component="span"
            onClick={handleReset}
            sx={{
              color: "#5CA5A5",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Reset filters
          </Box>
        </Paper>
      )}
    </Container>
  );
}