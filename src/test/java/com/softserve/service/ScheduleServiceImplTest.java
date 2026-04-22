package com.softserve.service;

import com.softserve.dto.ScheduleSaveDTO;
import com.softserve.dto.ScheduleWithoutSemesterDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Lesson;
import com.softserve.entity.Period;
import com.softserve.entity.Room;
import com.softserve.entity.Schedule;
import com.softserve.entity.Semester;
import com.softserve.entity.Teacher;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.mapper.ScheduleSaveMapper;
import com.softserve.mapper.ScheduleWithoutSemesterMapper;
import com.softserve.repository.LessonRepository;
import com.softserve.repository.PeriodRepository;
import com.softserve.repository.RoomRepository;
import com.softserve.repository.ScheduleRepository;
import com.softserve.service.ScheduleCacheService;
import com.softserve.service.impl.ScheduleServiceImpl;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceImplTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private ScheduleCacheService cacheService;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private PeriodRepository periodRepository;

    @Mock
    private ScheduleSaveMapper scheduleSaveMapper;

    @Mock
    private ScheduleWithoutSemesterMapper scheduleWithoutSemesterMapper;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private ScheduleServiceImpl scheduleServiceImpl;

    @Test
    void shouldReturnAllSchedulesFromRepository() {
        List<Schedule> schedules = List.of(new Schedule(), new Schedule());

        when(scheduleRepository.getAll()).thenReturn(schedules);

        List<Schedule> result = scheduleServiceImpl.getAll();

        assertNotNull(result);
        assertEquals(schedules, result);
        verify(scheduleRepository, times(1)).getAll();
    }

    @Test
    void shouldDeleteSchedulesBySemesterIdAndEvictAllCaches() {
        Long semesterId = 42L;

        doNothing().when(scheduleRepository).deleteSchedulesBySemesterId(semesterId);
        doNothing().when(cacheService).evictAllScheduleCaches();

        scheduleServiceImpl.deleteSchedulesBySemesterId(semesterId);

        verify(scheduleRepository, times(1)).deleteSchedulesBySemesterId(semesterId);
        verify(cacheService, times(1)).evictAllScheduleCaches();
    }

    @Test
    void shouldSaveScheduleForUngroupedLessonAndReturnDto() {
        ScheduleSaveDTO scheduleSaveDTO = new ScheduleSaveDTO();
        scheduleSaveDTO.setLessonId(1L);
        scheduleSaveDTO.setRoomId(2L);
        scheduleSaveDTO.setPeriodId(3L);
        scheduleSaveDTO.setEvenOdd(EvenOdd.ODD);
        scheduleSaveDTO.setDayOfWeek(DayOfWeek.MONDAY);

        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setGrouped(false);
        lesson.setSemester(new Semester());
        lesson.getSemester().setId(6L);
        lesson.setGroup(new Group());
        lesson.getGroup().setId(5L);
        lesson.setTeacher(new Teacher());
        lesson.getTeacher().setId(7L);

        Room room = new Room();
        room.setId(2L);

        Period period = new Period();
        period.setId(3L);

        Schedule schedule = new Schedule();
        schedule.setLesson(lesson);
        schedule.setRoom(room);
        schedule.setPeriod(period);
        schedule.setEvenOdd(EvenOdd.ODD);
        schedule.setDayOfWeek(DayOfWeek.MONDAY);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(roomRepository.findById(2L)).thenReturn(Optional.of(room));
        when(periodRepository.findById(3L)).thenReturn(Optional.of(period));
        when(scheduleSaveMapper.scheduleSaveDTOToSchedule(scheduleSaveDTO)).thenReturn(schedule);
        when(scheduleRepository.save(schedule)).thenAnswer(invocation -> {
            Schedule saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });
        when(scheduleRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(schedule));
        when(scheduleWithoutSemesterMapper.scheduleToScheduleWithoutSemesterDTOs(List.of(schedule)))
                .thenReturn(List.of(new ScheduleWithoutSemesterDTO()));
        doNothing().when(cacheService).evictCachesForSchedule(6L, 5L, 7L);

        List<ScheduleWithoutSemesterDTO> result = scheduleServiceImpl.saveSchedule(scheduleSaveDTO);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(scheduleRepository, times(1)).save(schedule);
        verify(scheduleRepository, times(1)).findByIdWithDetails(100L);
        verify(cacheService, times(1)).evictCachesForSchedule(null, null, null);
    }

    @Test
    void shouldGetAllSchedulesAndReturnEmptyList() {
        List<Schedule> emptySchedules = new ArrayList<>();

        when(scheduleRepository.getAll()).thenReturn(emptySchedules);

        List<Schedule> result = scheduleServiceImpl.getAll();

        assertNotNull(result);
        assertEquals(0, result.size());
        verify(scheduleRepository, times(1)).getAll();
    }

    @Test
    void shouldDeleteSchedulesBySemesterIdWithZeroId() {
        Long semesterId = 0L;

        doNothing().when(scheduleRepository).deleteSchedulesBySemesterId(semesterId);
        doNothing().when(cacheService).evictAllScheduleCaches();

        scheduleServiceImpl.deleteSchedulesBySemesterId(semesterId);

        verify(scheduleRepository, times(1)).deleteSchedulesBySemesterId(semesterId);
        verify(cacheService, times(1)).evictAllScheduleCaches();
    }

    @Test
    void shouldDeleteSchedulesBySemesterIdWithLargeId() {
        Long semesterId = 999999L;

        doNothing().when(scheduleRepository).deleteSchedulesBySemesterId(semesterId);
        doNothing().when(cacheService).evictAllScheduleCaches();

        scheduleServiceImpl.deleteSchedulesBySemesterId(semesterId);

        verify(scheduleRepository, times(1)).deleteSchedulesBySemesterId(semesterId);
        verify(cacheService, times(1)).evictAllScheduleCaches();
    }

}
