import { Typography, Container } from "@mui/material";
import data from "../data/data.json";
import JobListing from "../components/JobListing";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: 800,
          textAlign: "center",
          color: "#2C3A3A",
          mb: 6,
          letterSpacing: "-0.5px",
        }}
      >
        Job Filtering Board
      </Typography>

      {data.map((job) => (
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
    </Container>
  );
}