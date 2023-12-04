##-------------------------API
from fastapi import FastAPI

from app.presentation.routes.etls_routes import etls_router
from jobs.mpd_Jobs import configure_cron_jobs, start_cron_jobs


app = FastAPI()

configure_cron_jobs()
start_cron_jobs()


app.include_router(etls_router)

