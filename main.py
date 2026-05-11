from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import Optional

DATABASE_URL = "sqlite:///nhl_players.db"
engine = create_engine(DATABASE_URL)

app = FastAPI()


class Player(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    player: str
    season: str
    team: str
    position: str
    games_played: int
    goals: int
    assists: int
    points: int
    plus_minus: int


class PlayerCreate(SQLModel):
    player: str
    season: str
    team: str
    position: str
    games_played: int
    goals: int
    assists: int
    points: int
    plus_minus: int


@app.get("/players")
def get_players():
    with Session(engine) as session:
        players = session.exec(select(Player)).all()
        return players


@app.post("/players")
def add_player(new_player: PlayerCreate):
    player = Player(
        player=new_player.player,
        season=new_player.season,
        team=new_player.team,
        position=new_player.position,
        games_played=new_player.games_played,
        goals=new_player.goals,
        assists=new_player.assists,
        points=new_player.points,
        plus_minus=new_player.plus_minus
    )

    with Session(engine) as session:
        session.add(player)
        session.commit()
        session.refresh(player)
        return player


@app.get("/leaders/{stat}")
def get_leaders(stat: str):
    allowed_stats = {
        "goals": Player.goals,
        "assists": Player.assists,
        "points": Player.points,
        "games": Player.games_played,
        "plus_minus": Player.plus_minus
    }

    if stat not in allowed_stats:
        return {"error": "Invalid stat"}

    with Session(engine) as session:
        statement = select(Player).order_by(allowed_stats[stat].desc()).limit(5)
        leaders = session.exec(statement).all()
        return leaders


app.mount("/", StaticFiles(directory="static", html=True), name="static")