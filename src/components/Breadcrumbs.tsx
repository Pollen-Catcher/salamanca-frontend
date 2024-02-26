import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Breadcrumbs() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const pathnames = pathname.split('/').filter(Boolean)

  return (
    <MUIBreadcrumbs color="inherit" aria-label="breadcrumb">
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        return isLast ? (
          <Typography key={name} color="inherit">
            {name}
          </Typography>
        ) : (
          <Link key={name} color="inherit" onClick={() => navigate(routeTo)}>
            {name}
          </Link>
        )
      })}
    </MUIBreadcrumbs>
  )
}
