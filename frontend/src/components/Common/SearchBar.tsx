import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  delay?: number
  fullWidth?: boolean
}

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  delay = 500,
  fullWidth = false,
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value)

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, delay)

    return () => clearTimeout(timer)
  }, [localValue, onChange, delay])

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        size="small"
        fullWidth={fullWidth}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: localValue && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
          },
        }}
      />
    </Box>
  )
}

export default SearchBar