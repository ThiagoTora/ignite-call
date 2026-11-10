"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Calendar } from "../../../../../components/Calendar";
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles";
import { api } from "@/src/lib/axios";

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void;
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const params = useParams<{ username: string }>();
  const username = params.username;

  const isDateSelected = !!selectedDate;
  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const describedDate = selectedDate
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null;

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  const { data: availability } = useQuery<Availability>({
    queryKey: ["availability", username, selectedDateWithoutTime],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      });

      return response.data;
    },
    enabled: !!selectedDate,
  });

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate();

    onSelectDateTime(dateWithTime);
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar
        username={username}
        selectedDate={selectedDate}
        onDateSelected={setSelectedDate}
      />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => (
              <TimePickerItem
                key={hour}
                onClick={() => handleSelectTime(hour)}
                disabled={!availability.availableTimes.includes(hour)}
              >
                {String(hour).padStart(2, "0")}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
}
