import React, { useEffect, useRef, useState } from 'react';
import { Box, ButtonBase, CircularProgress, Dialog, IconButton, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SWIPE_THRESHOLD = 50;

// Small originals look best at full size; anything wider is served at 1280px to keep it quick
export const tmdbViewerSrc = (image) =>
  `https://image.tmdb.org/t/p/${image.width && image.width <= 1280 ? 'original' : 'w1280'}${image.file_path}`;
export const tmdbThumbSrc = (image) => `https://image.tmdb.org/t/p/w185${image.file_path}`;

const preload = (src) => {
  if (!src) return;
  const img = new Image();
  img.src = src;
};

/**
 * Full-screen image viewer with arrows, keyboard (← → Esc), swipe and a thumbnail strip.
 * images: [{ src, thumb }]; index: open image or null to close.
 */
const ImageViewer = ({ images, index, onIndexChange, onClose, title }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [loaded, setLoaded] = useState(false);
  const touchStart = useRef(null);
  const stripRef = useRef(null);
  const open = index !== null && index !== undefined && images.length > 0;
  const total = images.length;
  const current = open ? images[index] : null;

  const go = (delta) => {
    if (!open || total < 2) return;
    onIndexChange((index + delta + total) % total);
  };

  useEffect(() => {
    if (!open) return undefined;
    setLoaded(false);
    // Warm up the neighbours so arrowing through feels instant
    preload(images[(index + 1) % total]?.src);
    preload(images[(index - 1 + total) % total]?.src);
    // Keep the active thumbnail in view
    const thumb = stripRef.current?.querySelector(`[data-index="${index}"]`);
    if (thumb) thumb.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });

    const onKey = (event) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index]); // eslint-disable-line react-hooks/exhaustive-deps

  const onTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1);
    touchStart.current = null;
  };

  const arrowSx = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#fff',
    bgcolor: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(6px)',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{ sx: { bgcolor: '#08090C', borderRadius: 0, color: '#fff', backgroundImage: 'none' } }}
      aria-label={title ? `${title} images` : 'Image viewer'}
    >
      {current && (
        <Stack sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: { xs: 1.5, sm: 3 }, py: 1.5 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }} noWrap>
              {title ? `${title} · ` : ''}
              {index + 1} / {total}
            </Typography>
            <Tooltip title="Close (Esc)">
              <IconButton onClick={onClose} sx={{ color: '#fff' }} aria-label="Close image viewer">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={(event) => event.target === event.currentTarget && onClose()}
            sx={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 0, sm: 9 } }}
          >
            {!loaded && <CircularProgress sx={{ position: 'absolute', color: 'rgba(255,255,255,0.6)' }} />}
            <Box
              key={current.src}
              component="img"
              src={current.src}
              alt=""
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: { sm: '8px' },
                opacity: loaded ? 1 : 0,
                transition: 'opacity .2s',
                userSelect: 'none',
              }}
              draggable={false}
            />
            {total > 1 && !isSmall && (
              <>
                <IconButton onClick={() => go(-1)} sx={{ ...arrowSx, left: 16 }} aria-label="Previous image">
                  <ChevronLeftIcon fontSize="large" />
                </IconButton>
                <IconButton onClick={() => go(1)} sx={{ ...arrowSx, right: 16 }} aria-label="Next image">
                  <ChevronRightIcon fontSize="large" />
                </IconButton>
              </>
            )}
          </Box>

          {total > 1 && (
            <Box
              ref={stripRef}
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                px: { xs: 1.5, sm: 3 },
                py: 1.5,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
              }}
            >
              {images.map((image, i) => (
                <ButtonBase
                  key={image.src}
                  data-index={i}
                  onClick={() => onIndexChange(i)}
                  aria-label={`Image ${i + 1}`}
                  sx={{
                    flexShrink: 0,
                    height: { xs: 48, sm: 64 },
                    borderRadius: '6px',
                    overflow: 'hidden',
                    outline: i === index ? '2px solid #fff' : 'none',
                    outlineOffset: '2px',
                    opacity: i === index ? 1 : 0.55,
                    transition: 'opacity .15s',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <Box component="img" src={image.thumb || image.src} alt="" loading="lazy" sx={{ height: '100%', display: 'block' }} />
                </ButtonBase>
              ))}
            </Box>
          )}
        </Stack>
      )}
    </Dialog>
  );
};

export default ImageViewer;
