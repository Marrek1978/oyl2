-- AlterTable
ALTER TABLE "DesiresClarifyingQuestions" ALTER COLUMN "birthDate" DROP NOT NULL,
ALTER COLUMN "twentyFourHours" DROP NOT NULL,
ALTER COLUMN "twentyFourHours" SET DEFAULT '',
ALTER COLUMN "twentyFourRegrets" DROP NOT NULL,
ALTER COLUMN "twentyFourRegrets" SET DEFAULT '',
ALTER COLUMN "oneWeek" DROP NOT NULL,
ALTER COLUMN "oneWeek" SET DEFAULT '',
ALTER COLUMN "oneWeekRegrets" DROP NOT NULL,
ALTER COLUMN "oneWeekRegrets" SET DEFAULT '',
ALTER COLUMN "oneMonth" DROP NOT NULL,
ALTER COLUMN "oneMonth" SET DEFAULT '',
ALTER COLUMN "oneMonthRegrets" DROP NOT NULL,
ALTER COLUMN "oneMonthRegrets" SET DEFAULT '',
ALTER COLUMN "oneYear" DROP NOT NULL,
ALTER COLUMN "oneYear" SET DEFAULT '',
ALTER COLUMN "fiveYears" DROP NOT NULL,
ALTER COLUMN "fiveYears" SET DEFAULT '',
ALTER COLUMN "twentyYears" DROP NOT NULL,
ALTER COLUMN "twentyYears" SET DEFAULT '',
ALTER COLUMN "fiftyYears" DROP NOT NULL,
ALTER COLUMN "fiftyYears" SET DEFAULT '',
ALTER COLUMN "oneYearRegrets" DROP NOT NULL,
ALTER COLUMN "oneYearRegrets" SET DEFAULT '';
