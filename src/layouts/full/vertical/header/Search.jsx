// import { useState } from 'react';
// import {
//   IconButton,
//   Dialog,
//   DialogContent,
//   Stack,
//   Divider,
//   Box,
//   List,
//   ListItemText,
//   Typography,
//   TextField,
//   ListItemButton,
// } from '@mui/material';
// import { IconSearch, IconX } from '@tabler/icons-react';
// import Menuitems from '../sidebar/MenuItems';
// import { Link } from 'react-router';

// const Search = () => {
//   // drawer top
//   const [showDrawer2, setShowDrawer2] = useState(false);
//   const [search, setSerach] = useState('');

//   const handleDrawerClose2 = () => {
//     setShowDrawer2(false);
//   };

//   const filterRoutes = (rotr, cSearch) => {
//     if (rotr.length > 1)
//       return rotr.filter((t) =>
//         t.title ? t.href.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()) : '',
//       );
//     return rotr;
//   };
//   const searchData = filterRoutes(Menuitems, search);

//   return (
//     <>
//       <IconButton
//         aria-label="show 4 new mails"
//         color="inherit"
//         aria-controls="search-menu"
//         aria-haspopup="true"
//         onClick={() => setShowDrawer2(true)}
//         size="large"
//         style={{ color: 'white' }}
//       >
//         <IconSearch size="16" />
//       </IconButton>
//       <Dialog
//         open={showDrawer2}
//         onClose={() => setShowDrawer2(false)}
//         fullWidth
//         maxWidth={'sm'}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//         PaperProps={{ sx: { position: 'fixed', top: 30, m: 0 } }}
//       >
//         <DialogContent className="testdialog">
//           <Stack direction="row" spacing={2} alignItems="center">
//             <TextField
//               id="tb-search"
//               placeholder="Search here"
//               fullWidth
//               onChange={(e) => setSerach(e.target.value)}
//               inputProps={{ 'aria-label': 'Search here' }}
//             />
//             <IconButton size="small" onClick={handleDrawerClose2}>
//               <IconX size="18" />
//             </IconButton>
//           </Stack>
//         </DialogContent>
//         <Divider />
//         <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
//           <Typography variant="h5" p={1}>
//             Quick Page Links
//           </Typography>
//           <Box>
//             <List component="nav">
//               {searchData.map((menu) => {
//                 return (
//                   <Box key={menu.title ? menu.id : menu.subheader}>
//                     {menu.title && !menu.children ? (
//                       <ListItemButton sx={{ py: 0.5, px: 1 }} to={menu?.href} component={Link}>
//                         <ListItemText
//                           primary={menu.title}
//                           secondary={menu?.href}
//                           sx={{ my: 0, py: 0.5 }}
//                           onClick={handleDrawerClose2}
//                         />
//                       </ListItemButton>
//                     ) : (
//                       ''
//                     )}
//                     {menu.children ? (
//                       <>
//                         {menu.children.map((child) => {
//                           return (
//                             <ListItemButton
//                               sx={{ py: 0.5, px: 1 }}
//                               to={child.href}
//                               component={Link}
//                               onClick={handleDrawerClose2}
//                               key={child.title ? child.id : menu.subheader}
//                             >
//                               <ListItemText
//                                 primary={child.title}
//                                 secondary={child.href}
//                                 sx={{ my: 0, py: 0.5 }}
//                               />
//                             </ListItemButton>
//                           );
//                         })}
//                       </>
//                     ) : (
//                       ''
//                     )}
//                   </Box>
//                 );
//               })}
//             </List>
//           </Box>
//         </Box>
//       </Dialog>
//     </>
//   );
// };

// export default Search;
import { useState, useMemo } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemText,
  Typography,
  TextField,
  ListItemButton,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';
import Menuitems from '../sidebar/MenuItems';
import { Link } from 'react-router';

const Search = () => {
  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);
  const [search, setSearch] = useState('');

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  // --- permissions filter (as you wrote) ---
  const authData = JSON.parse(localStorage.getItem('user')) || {};
  const rolesAndPermission = authData.rolesAndPermission?.[0] || {};

  const filteredMenuitems = useMemo(
    () =>
      (Menuitems || []).filter(
        (item) =>
          item.permission === undefined ||
          rolesAndPermission?.accessAll === true ||
          rolesAndPermission?.[item.permission] === true,
      ),
    [rolesAndPermission],
  );

  // --- search filter applied on top of permission-filtered items ---
  const normalize = (v) => (v ? String(v).toLowerCase() : '');

  const filterBySearch = (items, query) => {
    const q = normalize(query);
    if (!q) return items;

    return (items || []).flatMap((item) => {
      const title = normalize(item.title);
      const href = normalize(item.href);
      const selfMatch = title.includes(q) || href.includes(q);

      if (Array.isArray(item.children) && item.children.length) {
        const childMatches = item.children.filter((c) => {
          const ct = normalize(c.title);
          const ch = normalize(c.href);
          return ct.includes(q) || ch.includes(q);
        });

        if (selfMatch) {
          // keep all children if parent matches
          return [{ ...item }];
        }
        if (childMatches.length) {
          // keep only matching children if parent doesn't match
          return [{ ...item, children: childMatches }];
        }
        return [];
      }

      return selfMatch ? [item] : [];
    });
  };

  const searchData = useMemo(
    () => filterBySearch(filteredMenuitems, search),
    [filteredMenuitems, search],
  );

  return (
    <>
      <IconButton
        aria-label="open search"
        color="inherit"
        aria-controls="search-menu"
        aria-haspopup="true"
        onClick={() => setShowDrawer2(true)}
        size="large"
        style={{ color: '#e7fffb' }}
      >
        <IconSearch size="16" />
      </IconButton>

      <Dialog
        open={showDrawer2}
        onClose={() => setShowDrawer2(false)}
        fullWidth
        maxWidth={'sm'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { position: 'fixed', top: 30, m: 0 } }}
      >
        <DialogContent className="testdialog">
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              id="tb-search"
              placeholder="Search here"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              inputProps={{ 'aria-label': 'Search here' }}
            />
            <IconButton size="small" onClick={handleDrawerClose2}>
              <IconX size="18" />
            </IconButton>
          </Stack>
        </DialogContent>
        <Divider />
        <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="h5" p={1}>
            Quick Page Links
          </Typography>
          <Box>
            <List component="nav">
              {searchData.map((menu) => (
                <Box key={menu.id ?? menu.subheader ?? menu.href ?? Math.random()}>
                  {menu.title && !menu.children ? (
                    <ListItemButton
                      sx={{ py: 0.5, px: 1 }}
                      to={menu?.href}
                      component={Link}
                      onClick={handleDrawerClose2}
                    >
                      <ListItemText
                        primary={menu.title}
                        secondary={menu?.href}
                        sx={{ my: 0, py: 0.5 }}
                      />
                    </ListItemButton>
                  ) : null}

                  {Array.isArray(menu.children) && menu.children.length ? (
                    <>
                      {menu.children.map((child) => (
                        <ListItemButton
                          sx={{ py: 0.5, px: 1 }}
                          to={child.href}
                          component={Link}
                          onClick={handleDrawerClose2}
                          key={child.id ?? child.title ?? child.href}
                        >
                          <ListItemText
                            primary={child.title}
                            secondary={child.href}
                            sx={{ my: 0, py: 0.5 }}
                          />
                        </ListItemButton>
                      ))}
                    </>
                  ) : null}
                </Box>
              ))}
            </List>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Search;
