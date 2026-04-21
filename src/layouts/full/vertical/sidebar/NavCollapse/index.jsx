// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import { useState } from 'react';

import { useLocation } from 'react-router';

// mui imports
import {
  Box,
  ListItemIcon,
  ListItemButton,
  Collapse,
  styled,
  ListItemText,
  useTheme,
  Typography,
  alpha,
} from '@mui/material';

// custom imports
import NavItem from '../NavItem';

// plugins
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

// FC Component For Dropdown Menu
const NavCollapse = ({ menu, level, pathWithoutLastPart, pathDirect, hideMenu, onClick }) => {
  const Icon = menu?.icon;
  const theme = useTheme();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const menuIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;

  const handleClick = () => {
    setOpen(!open);
  };

  // menu collapse for sub-levels
  React.useEffect(() => {
    setOpen(false);
    menu?.children?.forEach((item) => {
      if (item?.href === pathname || (item?.href !== '/' && pathname.startsWith(item?.href))) {
        setOpen(true);
      }
    });
  }, [pathname, menu.children]);

  // Check if any child matches the current path
  const isChildActive = menu.children?.some((item) => {
    if (item.children) {
      return item.children.some((child) => pathname === child.href || (child.href !== '/' && pathname.startsWith(child.href)));
    }
    return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
  });

  const ListItemStyled = styled(ListItemButton)(() => ({
    marginBottom: '8px',
    padding: '12px 14px',
    paddingLeft: hideMenu ? '14px' : level > 2 ? `${level * 15}px` : '14px',
    backgroundColor: isChildActive ? alpha(theme.palette.primary.main, 0.22) : 'transparent',
    whiteSpace: 'pre-line',
    borderRadius: '18px',
    border: isChildActive ? `1px solid ${alpha(theme.palette.primary.main, 0.45)}` : '1px solid transparent',
    boxShadow: isChildActive ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.25)}, 0 12px 24px rgba(0, 0, 0, 0.22)` : 'none',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      color: '#ffffff',
    },
    color: isChildActive ? '#ffffff' : 'rgba(227, 248, 244, 0.84)',
    fontWeight: isChildActive ? 600 : 400,
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.22),
      color: '#ffffff',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.24),
        color: '#ffffff',
      },
    },
  }));

  // If Menu has Children
  const submenus = menu.children?.map((item) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item?.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    }
  });

  return (
    <>
      <ListItemStyled
        onClick={handleClick}
        selected={isChildActive}
        key={menu?.id}
      >
        <ListItemIcon
          sx={{
            minWidth: '48px',
            p: '0',
            color: isChildActive ? '#effffb' : 'inherit',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isChildActive ? alpha(theme.palette.primary.main, 0.16) : 'rgba(255, 255, 255, 0.03)',
              border: isChildActive ? '1px solid rgba(142, 243, 232, 0.18)' : '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {menuIcon}
          </Box>
        </ListItemIcon>
        <ListItemText color="inherit" sx={{ m: 0 }}>
          {hideMenu ? (
            ''
          ) : (
            <Typography
              variant="body2"
              noWrap
              sx={{ fontSize: '0.92rem', lineHeight: 1.15, fontWeight: isChildActive ? 600 : 500 }}
            >
              {t(`${menu.title}`)}
            </Typography>
          )}
        </ListItemText>
        {!open ? <IconChevronDown size="1rem" /> : <IconChevronUp size="1rem" />}
      </ListItemStyled>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {submenus}
      </Collapse>
    </>
  );
};

export default NavCollapse;
