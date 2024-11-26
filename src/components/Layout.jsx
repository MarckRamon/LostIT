import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#F5F6F7',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
    },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const menuItems = [
    { text: 'Dashboard Analytics', icon: <DashboardIcon />, path: '/' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Claim Logs', icon: <InventoryIcon />, path: '/claim-log'},
    { text: 'Users', icon: <PeopleIcon />, path: '/users' }, // New Users menu item
  ];

  const drawer = (
    <>
      <Toolbar sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left'}}>
        <Box
          component="img"
          src="/LostITbg.png"
          alt="LostIT Logo"
          sx={{ 
            height: 48, 
            width: 48,
            ml: -0.5,
            objectFit: 'contain'
          }}
        />
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          onClick={() => navigate('/')}
          sx={{ 
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1.5rem',
            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          LostIT
        </Typography>
      </Toolbar>
      <Divider sx={{ opacity: 0.1 }} />
      <List sx={{ px: 2, py: 1, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  }
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'white' : 'primary.main'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === item.path ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ opacity: 0.1 }} />
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => navigate('/edit-profile')}
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: 'primary.main'
            }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Profile" 
              primaryTypographyProps={{
                fontSize: '0.9rem',
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: 'error.main'
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.9rem',
                color: 'error.main'
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ minHeight: '80px !important', display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' },
                color: 'text.primary'
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box
                component="img"
                src="/LostITbg.png"
                alt="LostIT Logo"
                sx={{
                  height: 48,
                  width: 48,
                  objectFit: 'contain',
                  display: { xs: 'none', sm: 'block' },
                  mr: 2
                }}
              />
              <Typography 
                variant="h6" 
                noWrap 
                component="div" 
                sx={{ 
                  color: 'text.primary',
                  fontSize: '1.2rem',
                  fontWeight: 500
                }}
              >
                {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
              </Typography>
            </Box>
            <IconButton 
              color="inherit"
              onClick={toggleDarkMode}
              sx={{ color: 'text.primary' }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
            bgcolor: 'background.default',
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Layout;