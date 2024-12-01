import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface MealSchedule {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export default function UserCalendar({
  userId,
}: {
  userId: string | undefined;
}) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [mealSchedule, setMealSchedule] = React.useState<MealSchedule | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchMealSchedule = async (date: Date) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/admin/meal-schedule",
        {
          userId,
          date: format(date, "yyyy-MM-dd"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMealSchedule(()=>response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching meal schedule:", error);
      setMealSchedule(null);
    } finally {
      setIsLoading(false);
    }
  };
console.log(mealSchedule?.lunch)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          initialFocus
          components={{
            Day: ({ date: dayDate, ...props }) => (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    {...props}
                    variant="ghost"
                    className={cn(
                      "h-9 w-9",
                      !(props.displayMonth.getMonth() === dayDate.getMonth()) &&
                        "text-muted-foreground opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => fetchMealSchedule(dayDate)}
                  >
                    {dayDate && format(dayDate, "d").toString()}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {format(dayDate, "MMMM d, yyyy")} Meal Plan
                    </p>
                    {isLoading ? (
                      <p className="text-sm text-muted-foreground">
                        Loading meal schedule...
                      </p>
                    ) : mealSchedule ? (
                      <>
                        <p className="text-sm">
                          Breakfast:{" "}
                          {mealSchedule?.breakfast || "No breakfast planned"}
                        </p>
                        <p className="text-sm">
                          Lunch: {mealSchedule?.lunch || "No lunch planned" }
                        </p>
                        <p className="text-sm">
                          Dinner: {mealSchedule?.dinner || "No dinner planned"}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No meals planned for this day
                      </p>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
