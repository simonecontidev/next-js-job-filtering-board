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
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import JobListing from "../components/JobListing";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

import data from "../data/data.json";

// ----------------------
// Tipi e costanti
// ----------------------
type Job = typeof data[number];
type SortKey = "recent" | "company" | "role" | "level";

// Framer Motion variants
const listVariants = {
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// ----------------------
// Component
// ----------------------
export default function Home() {
  const theme = useTheme();

  // Stato filtri
  const [search, setSearch] = React.useState("");
  const [onlyNew, setOnlyNew] = React.useState(false);
  const [onlyFeatured, setOnlyFeatured] = React.useState(false);
  const [role, setRole] = React.useState<string | "">("");
  const [level, setLevel] = React.useState<string | "">("");
  const [contract, setContract] = React.useState<string | "">("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<SortKey>("recent");
  const [snackOpen, setSnackOpen] = React.useState(false);

  // Opzioni derivate
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

  // Filtro + Ordinamento
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

    if (sortBy === "company")
      return out.slice().sort((a, b) => a.company.localeCompare(b.company));
    if (sortBy === "role")
      return out.slice().sort((a, b) => a.role.localeCompare(b.role));
    if (sortBy === "level")
      return out.slice().sort((a, b) => a.level.localeCompare(b.level));
    return out;
  }, [search, onlyNew, onlyFeatured, role, level, contract, selectedTags, sortBy]);

  // Reset
  const handleReset = () => {
    setSearch("");
    setOnlyNew(false);
    setOnlyFeatured(false);
    setRole("");
    setLevel("");
    setContract("");
    setSelectedTags([]);
    setSortBy("recent");
  };

  // Click su tag
  const handleTagClick = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={(t) => ({
          fontWeight: 800,
          textAlign: "center",
          color: t.palette.mode === "dark" ? "#FFFFFF" : "#2C3A3A",
          mb: 1.5,
          letterSpacing: "-0.5px",
        })}
      >
        Job Filtering Board
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{ color: theme.palette.mode === "dark" ? "#A9C0C0" : "#7C8F8F", mb: 3 }}
      >
        {filtered.length} result{filtered.length === 1 ? "" : "s"}
      </Typography>

      {/* FILTER BAR (sticky con gap dall'alto) */}
      <Paper
        elevation={3}
        sx={{
          position: "sticky",
          top: 12,              // ← piccolo gap dal bordo del viewport
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
                control={
                  <Switch
                    checked={onlyNew}
                    onChange={(e) => setOnlyNew(e.target.checked)}
                  />
                }
                label="NEW"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={onlyFeatured}
                    onChange={(e) => setOnlyFeatured(e.target.checked)}
                  />
                }
                label="FEATURED"
              />
            </Box>
          </Box>

          {/* Role / Level */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
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
          </Box>

          {/* Contract + Sort + Tags */}
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
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
              renderInput={(params) => (
                <TextField {...params} label="Tags (languages & tools)" />
              )}
            />
          </Box>
        </Box>

        {/* Toggle + Reset (allineati a destra) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 3,
            mt: 2,
          }}
        >
          <ThemeToggle />
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

      {/* ------------------ JOB LISTINGS (animated) ------------------ */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key="jobs-list"
          variants={listVariants}
          initial={false}
          animate="animate"
        >
          {filtered.map((job) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
            >
              <JobListing
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
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Paper
            variant="outlined"
            sx={{
              textAlign: "center",
              py: 6,
              borderRadius: 3,
              color: theme.palette.mode === "dark" ? "#A9C0C0" : "#7C8F8F",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3A3A",
              }}
            >
              Nessun risultato — prova a rimuovere 1 filtro 🌴
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
        </motion.div>
      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Copied!
        </Alert>
      </Snackbar>
    </Container>
  );
}