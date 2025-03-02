// app/import/page.tsx
"use client";
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link'; // Import the Link component

interface Tool {
  name: string;
  category: string;
  description: string;
  link: string;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  maxWidth: "800px",
  margin: "0 auto",
  marginTop: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiInputBase-root": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
});

export default function ImportPage() {
  const theme = useTheme();
  const [jsonInput, setJsonInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    setImportStatus(null); // Clear previous status
    try {
      const tools: Tool[] = JSON.parse(jsonInput);

      if (!Array.isArray(tools)) {
        throw new Error('Invalid JSON: Must be an array of tools.');
      }

      if (tools.length === 0) {
        setImportStatus({ success: false, message: 'No tools to import.' });
        setIsLoading(false);
        return;
      }

      const importPromises = tools.map(async (tool) => {
        if (!tool.name || !tool.category || !tool.description || !tool.link) {
          console.warn("Skipping tool due to missing fields:", tool);
          return;
        }

        const response = await fetch('/api/tools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tool),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to add tool: ${response.status} - ${errorData.message || "Unknown error"}`);
        }
      });

      await Promise.all(importPromises);
      setImportStatus({ success: true, message: 'Tools imported successfully!' });

    } catch (error: any) {
      console.error('Error importing tools:', error);
      setImportStatus({ success: false, message: `Import failed: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Import AI Tools from JSON
      </Typography>

      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        Paste your JSON data below.  Make sure it's an array of tool objects.
        Each object should have `name`, `category`, `description`, and `link` properties.
      </Typography>

      <StyledTextField
        label="JSON Data"
        variant="outlined"
        multiline
        rows={12} // Increased rows for a larger text area
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='[{"name": "Tool Name", "category": "Category", "description": "Tool Description", "link": "https://example.com"}]'
        fullWidth // Make the TextField span the full width of the container
      />

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledButton onClick={handleImport} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Import Tools"}
        </StyledButton>
      </Box>

      {importStatus && (
        <Alert severity={importStatus.success ? 'success' : 'error'} sx={{ mt: 3 }}>
          {importStatus.message}
        </Alert>
      )}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button component={Link} href="/" variant="outlined" sx={{ mr: 2 }}>
                    Homepage
                </Button>
                <Button component={Link} href="/admin" variant="outlined">
                    Admin Panel
                </Button>
            </Box>
    </StyledContainer>
  );
}