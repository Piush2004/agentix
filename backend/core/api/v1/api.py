from fastapi import APIRouter, Depends
from core.auth import set_user_context, get_current_admin
from core.api.v1 import routes_data, routes_platform, routes_auth, routes_jobs
from core.api.v1 import routes_system

api_router = APIRouter()

# Public (Standard User) Routes
api_router.include_router(routes_data.router, prefix="/dataset", tags=["Dataset"], dependencies=[Depends(set_user_context)])
api_router.include_router(routes_platform.router, prefix="/platform", tags=["Platform Capabilities"], dependencies=[Depends(set_user_context)])
api_router.include_router(routes_jobs.router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(routes_auth.router, prefix="/auth", tags=["Authentication"])

# Admin Routes (Protected by get_current_admin)
admin_router = APIRouter(dependencies=[Depends(get_current_admin)])
admin_router.include_router(routes_system.router, prefix="/system", tags=["System"])

api_router.include_router(admin_router, prefix="/admin")
