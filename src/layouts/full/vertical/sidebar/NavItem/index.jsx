import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router';
// mui imports
import {
  Box,
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
  alpha,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
const NavItem = ({ item, level, pathDirect, onClick, hideMenu }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const { t } = useTranslation();
  const itemIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;
  const isActive = pathDirect === item.href || (item.href !== '/' && pathDirect.startsWith(item.href));

  const ListItemStyled = styled(ListItem)(() => ({
    whiteSpace: 'pre-line',
    marginBottom: '8px',
    padding: '12px 14px',
    borderRadius: '18px',
    backgroundColor: 'transparent',
    color: 'rgba(227, 248, 244, 0.84)',
    paddingLeft: hideMenu ? '14px' : level > 2 ? `${level * 15}px` : '14px',
    minHeight: '52px',
    border: '1px solid transparent',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      color: '#ffffff',
      borderColor: alpha(theme.palette.primary.main, 0.18),
    },
    '&.active, &.Mui-selected': {
      color: '#ffffff !important',
      backgroundColor: `${alpha(theme.palette.primary.main, 0.22)} !important`,
      borderColor: `${alpha(theme.palette.primary.main, 0.45)} !important`,
      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.25)}, 0 12px 24px rgba(0, 0, 0, 0.22)`,
      '& .MuiListItemIcon-root': {
        color: '#ffffff !important',
      },
      '&:hover': {
        backgroundColor: `${alpha(theme.palette.primary.main, 0.24)} !important`,
        color: '#ffffff !important',
      },
    },
  }));

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button="true"
        component={item.external ? 'a' : NavLink}
        to={item.href}
        href={item.external ? item.href : ''}
        disabled={item.disabled}
        selected={pathDirect === item.href || (item.href !== '/' && pathDirect.startsWith(item.href))}
        target={item.external ? '_blank' : ''}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: '48px',
            p: '0',
            color: 'inherit',
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
              bgcolor: isActive ? alpha(theme.palette.primary.main, 0.16) : 'rgba(255, 255, 255, 0.03)',
              border: isActive ? '1px solid rgba(142, 243, 232, 0.18)' : '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {itemIcon}
          </Box>
        </ListItemIcon>
        <ListItemText sx={{ m: 0 }}>
          {hideMenu ? (
            ''
          ) : (
            <Typography
              variant="body2"
              noWrap
              sx={{ fontSize: '0.92rem', lineHeight: 1.15, fontWeight: 600 }}
            >
              {t(`${item.title}`)}
            </Typography>
          )}
          <br />
          {item.subtitle ? (
            <Typography
              variant="caption"
              noWrap
              sx={{ color: 'rgba(227, 248, 244, 0.62)', fontSize: '0.74rem' }}
            >
              {hideMenu ? '' : item.subtitle}
            </Typography>
          ) : (
            ''
          )}
        </ListItemText>

        {!item.chip || hideMenu ? null : (
          <Chip
            color={item.chipColor}
            variant={item.variant ? item.variant : 'filled'}
            size="small"
            label={item.chip}
          />
        )}
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;
