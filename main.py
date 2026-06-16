from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from datetime import date

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def home(request: Request):
    matura_date = date(2027, 5, 4)
    today = date.today()
    days_left = (matura_date - today).days

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"days_left": days_left}
    )