-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "login" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "lastRoom" TEXT
);

-- CreateTable
CREATE TABLE "UserLastPosition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "z" REAL NOT NULL,
    CONSTRAINT "UserLastPosition_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserLastRotation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "w" REAL NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "z" REAL NOT NULL,
    CONSTRAINT "UserLastRotation_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Teleport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromRoomName" TEXT NOT NULL,
    "toRoomName" TEXT NOT NULL,
    "fromX" REAL NOT NULL,
    "fromY" REAL NOT NULL,
    "fromZ" REAL NOT NULL,
    "toX" REAL NOT NULL,
    "toY" REAL NOT NULL,
    "toZ" REAL NOT NULL,
    CONSTRAINT "Teleport_fromRoomName_fkey" FOREIGN KEY ("fromRoomName") REFERENCES "Room" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Teleport_toRoomName_fkey" FOREIGN KEY ("toRoomName") REFERENCES "Room" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");

-- CreateIndex
CREATE UNIQUE INDEX "UserLastPosition_id_key" ON "UserLastPosition"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserLastRotation_id_key" ON "UserLastRotation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
