from sqlmodel import SQLModel, Field, Session, create_engine
from typing import Optional
import csv
import os

DATABASE_URL = "sqlite:///nhl_players.db"

if os.path.exists("nhl_players.db"):
    os.remove("nhl_players.db")

engine = create_engine(DATABASE_URL)

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

SQLModel.metadata.create_all(engine)

count = 0

with Session(engine) as session:

    with open("players.csv", newline="", encoding="utf-8") as file:

        reader = csv.DictReader(file)

        for row in reader:

            player = Player(
                player=row["player"],
                season=row["season"],
                team=row["team"],
                position=row["position"],
                games_played=int(row["games_played"]),
                goals=int(row["goals"]),
                assists=int(row["assists"]),
                points=int(row["points"]),
                plus_minus=int(row["plus_minus"])
            )

            session.add(player)

            count += 1

    session.commit()

print(f"{count} players added to database!")