import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Box, 
  Grid, 
  Typography, 
  CircularProgress, 
  TextField, 
  Button,
  IconButton,
  CssBaseline
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ArrowBackIos as ArrowBackIcon, 
  ArrowForwardIos as ArrowForwardIcon 
} from '@mui/icons-material';

interface ApodData {
  title: string;
  url: string;
  explanation: string;
  media_type: string;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212',
    },
    primary: {
      main: '#90caf9',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  }
});

function App() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [queryDate, setQueryDate] = useState(new Date().toISOString().split('T')[0]);
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchApod = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.REACT_APP_NASA_API_KEY;
        if (!apiKey) {
           throw new Error("API Key is missing.");
        }

        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${queryDate}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching APOD:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApod();
  }, [queryDate]);

  useEffect(() => {
    setInputDate(queryDate);
  }, [queryDate]);

  const handleSearch = () => {
    setQueryDate(inputDate);
  };

  const changeDate = (days: number) => {
    const currentDate = new Date(queryDate);
    currentDate.setDate(currentDate.getDate() + days);
    const newDate = currentDate.toISOString().split('T')[0];
    
    // Check if future
    const today = new Date().toISOString().split('T')[0];
    if (newDate > today) return;

    setQueryDate(newDate);
  };

  const isNextDisabled = () => {
     const today = new Date().toISOString().split('T')[0];
     return queryDate >= today;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden', 
        display: 'flex', 
        alignItems: 'center',
        p: { xs: 2, md: 5 } // Padding logic from before
      }}>
        {loading ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : data ? (
          <Grid container spacing={4} sx={{ height: '100%', alignItems: 'center' }}>
            {/* Media Section */}
            <Grid size={{ xs: 12, md: 8 }} sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {data.media_type === 'image' ? (
                <Box 
                  component="img" 
                  src={data.url} 
                  alt={data.title}
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain' 
                  }}
                />
              ) : (
                 <Box 
                    component="iframe" 
                    title="space-video" 
                    src={data.url} 
                    sx={{
                       width: '100%',
                       height: '100%',
                       border: 0
                    }}
                    allow="encrypted-media"
                    allowFullScreen
                 />
              )}
            </Grid>

            {/* Info Section */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ height: { xs: 'auto', md: '100%' }, overflowY: { xs: 'visible', md: 'auto' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                {/* Controls */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton onClick={() => changeDate(-1)} aria-label="previous day">
                        <ArrowBackIcon />
                    </IconButton>
                    
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        inputProps={{ max: new Date().toISOString().split('T')[0] }}
                        sx={{ flexGrow: 1 }}
                    />

                    <Button 
                        variant="contained" 
                        onClick={handleSearch}
                        startIcon={<SearchIcon />}
                    >
                        Search
                    </Button>

                    <IconButton 
                        onClick={() => changeDate(1)} 
                        disabled={isNextDisabled()}
                        aria-label="next day"
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </Box>

                <Typography variant="h4" component="h2" gutterBottom>
                  {data.title}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {data.explanation}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h6" color="error">Failed to load content.</Typography>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
