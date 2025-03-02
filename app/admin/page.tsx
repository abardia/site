// app/admin/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  maxWidth: "800px",
  margin: "0 auto",
  marginTop: theme.spacing(2),
}));

const StyledForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  "& .MuiInputBase-root": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  fontSize: '0.8rem',
}));

const StyledDeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
   fontSize: '0.8rem',
}));
const StyledDangerButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.error.darker,
    color: theme.palette.common.white,
    "&:hover": {
        backgroundColor: theme.palette.error.dark,
    },
     fontSize: '0.8rem',
}));


const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  padding: theme.spacing(1),
  fontSize: '0.9rem',
}));

const StyledLink = styled("a")(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  fontSize: '0.9rem',
  "&:hover": {
    textDecoration: "underline",
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: theme.spacing(2),
}));

export default function AdminPanel() {
  const theme = useTheme();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState<Tool>({ id: "", name: "", category: "", description: "", link: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [toolNameToExclude, setToolNameToExclude] = useState("");
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedToolIds, setSelectedToolIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/tools");
        if (!res.ok) throw new Error(`Failed to fetch tools: ${res.status}`);
        const data: Tool[] = await res.json();
        setTools(data);
      } catch (error: any) {
        console.error("Failed to fetch tools:", error);
        showAlert("Failed to load tools.", 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTools();
  }, []);

  const showAlert = (message: string, severity: 'success' | 'error') => setAlert({ open: true, message, severity });
  const handleCloseAlert = () => setAlert(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormValues({ ...formValues, [e.target.name]: e.target.value });
  const handleEdit = (tool: Tool) => { setIsEditing(true); setFormValues({ ...tool }); };
  const handleCancelEdit = () => { setIsEditing(false); setFormValues({ id: "", name: "", category: "", description: "", link: "" }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/tools/${formValues.id}` : "/api/tools";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to ${isEditing ? "update" : "add"} tool: ${response.status} - ${errorData.message || 'Unknown'}`);
      }
      const updatedTools = await fetch("/api/tools").then(res => res.json())
      setTools(updatedTools);
      showAlert(`Tool ${isEditing ? "updated" : "added"}!`, 'success');
      handleCancelEdit();
    } catch (error: any) {
      console.error("Failed to submit tool:", error);
      showAlert(`Failed to ${isEditing ? "update" : "add"} tool: ${error.message || 'Unknown error'}.`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    //Confirmation removed
       try {
      const res = await fetch(`/api/tools/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete tool: ${res.status}`);
      setTools(prevTools => prevTools.filter(tool => tool.id !== id));
      showAlert("Tool deleted!", 'success');
    } catch (error: any) {
      console.error("Failed to delete tool:", error);
      showAlert(`Failed to delete tool: ${error.message || 'Unknown error'}.`, 'error');
    }
  };

  const handleDeleteAll = async () => {
    //Confirmation removed
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tools/delete-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excludeToolName: toolNameToExclude }),
      });
      if (!res.ok) throw new Error(`Failed to delete all tools: ${res.status}`);
      setTools([]);
      showAlert("All tools deleted!", 'success');
    } catch (error: any) {
      console.error("Failed to delete all tools:", error);
      showAlert(`Failed to delete all tools: ${error.message || 'Unknown error'}.`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectTool = (toolId: string) => {
    const newSelectedToolIds = new Set(selectedToolIds);
    if (selectedToolIds.has(toolId)) {
      newSelectedToolIds.delete(toolId);
    } else {
      newSelectedToolIds.add(toolId);
    }
    setSelectedToolIds(newSelectedToolIds);
  };

  const handleSelectAllTools = (checked: boolean) => {
    const newSelectedToolIds = new Set<string>();
    if (checked) {
      tools.forEach(tool => newSelectedToolIds.add(tool.id));
    }
    setSelectedToolIds(newSelectedToolIds);
  };

    const handleDeleteSelected = async () => {
        if (selectedToolIds.size === 0) {
            showAlert("No tools selected for deletion.", 'error');
            return;
        }
        if (!window.confirm(`Remove ${selectedToolIds.size} tools?`)) return; //Confirmation kept for delete selected

        setIsSubmitting(true);
        try {
            await Promise.all(
                Array.from(selectedToolIds).map(id => handleDelete(id))
            );
            const remainingTools = tools.filter(tool => !selectedToolIds.has(tool.id));
            setTools(remainingTools);
            setSelectedToolIds(new Set());
            showAlert("Selected tools deleted!", 'success');

        } catch (error: any) {
            console.error("Error deleting selected tools:", error);
            showAlert(`Failed to delete selected tools: ${error.message || 'Unknown error'}.`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };


  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {isEditing ? "Edit Tool" : "Add New Tool"}
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <StyledTextField label="Name" variant="outlined" name="name" value={formValues.name} onChange={handleChange} required />
        <StyledTextField label="Category" variant="outlined" name="category" value={formValues.category} onChange={handleChange} required />
        <StyledTextField label="Description" variant="outlined" name="description" value={formValues.description} onChange={handleChange} multiline rows={2} />
        <StyledTextField label="Link" variant="outlined" name="link" value={formValues.link} onChange={handleChange} required />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <StyledButton type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (isEditing ? "Save" : "Add Tool")}
          </StyledButton>
          {isEditing && (
            <StyledButton variant="outlined" onClick={handleCancelEdit} disabled={isSubmitting}>
              Cancel
            </StyledButton>
          )}
        </Box>
      </StyledForm>

      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mt: 4 }}>
        Existing Tools
      </Typography>
      {isLoading ? (<LoadingContainer><CircularProgress /></LoadingContainer>) : (
        <StyledTableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selectedToolIds.size > 0 && selectedToolIds.size < tools.length}
                    checked={tools.length > 0 && selectedToolIds.size === tools.length}
                    onChange={(e) => handleSelectAllTools(e.target.checked)}
                  />
                </StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Website</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id} selected={selectedToolIds.has(tool.id)}>
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedToolIds.has(tool.id)}
                      onChange={() => handleSelectTool(tool.id)}
                    />
                  </StyledTableCell>
                  {isEditing && formValues.id === tool.id ? (
                    <React.Fragment key={tool.id}>
                      <StyledTableCell><StyledTextField value={formValues.name} onChange={handleChange} name="name" size="small" fullWidth /></StyledTableCell>
                      <StyledTableCell><StyledTextField value={formValues.category} onChange={handleChange} name="category" size="small" fullWidth /></StyledTableCell>
                      <StyledTableCell><StyledTextField value={formValues.link} onChange={handleChange} name="link" size="small" fullWidth /></StyledTableCell>
                      <StyledTableCell>
                        {isSubmitting ? (<LoadingContainer><CircularProgress size={24} color="inherit" /></LoadingContainer>) : (
                          <StyledButton variant="contained" onClick={handleSubmit} disabled={isSubmitting} size="small">Save</StyledButton>
                        )}
                        <StyledButton variant="outlined" onClick={handleCancelEdit} disabled={isSubmitting} size="small">Cancel</StyledButton>
                      </StyledTableCell>
                    </React.Fragment>
                  ) : (
                    <>
                      <StyledTableCell>{tool.name}</StyledTableCell>
                      <StyledTableCell>{tool.category}</StyledTableCell>
                      <StyledTableCell>
                        <StyledLink href={tool.link} target="_blank" rel="noopener noreferrer">{tool.link}</StyledLink>
                      </StyledTableCell>
                      <StyledTableCell>
                        <StyledButton variant="contained" onClick={() => handleEdit(tool)} sx={{ mr: 1 }} disabled={isSubmitting} size="small">Edit</StyledButton>
                        <StyledDeleteButton variant="contained" onClick={() => handleDelete(tool.id)} disabled={isSubmitting} size="small">Delete</StyledDeleteButton>
                      </StyledTableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
      <Snackbar
                open={!!alert?.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity={alert?.severity} sx={{ width: '100%' }}>
                    {alert?.message}
                </Alert>
            </Snackbar>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, flexDirection: 'column', alignItems: 'center' }}>
                <Button component={Link} href="/" variant="outlined" sx={{ mr: 2, mb: 1 }} size="small">Homepage</Button>
                <Button component={Link} href="/import" variant="outlined" sx={{ mb: 1 }} size="small">Import Tools</Button>
                 <TextField
                    label="Tool Name to Exclude (Optional)"
                    variant="outlined"
                    value={toolNameToExclude}
                    onChange={(e) => setToolNameToExclude(e.target.value)}
                    size="small"
                    sx={{mb: 1, backgroundColor: theme.palette.background.paper}}
                    InputProps={{
                        style: { color: theme.palette.text.primary, fontSize: '0.9rem' },
                    }}
                    InputLabelProps={{
                        style: { color: theme.palette.text.secondary, fontSize: '0.9rem' },
                    }}
                />
        <StyledDangerButton variant="contained" onClick={handleDeleteAll} disabled={isLoading || isSubmitting}  size="small">DELETE ALL</StyledDangerButton>
        <StyledDangerButton
            variant="contained"
            onClick={handleDeleteSelected}
            disabled={isLoading || isSubmitting || selectedToolIds.size === 0}
            size="small"
        >
            Delete Selected
        </StyledDangerButton>
            </Box>
    </StyledContainer>
  );
}