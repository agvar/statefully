import { Colors, Spacing, Typography } from '@/constants/theme';
import { Activity } from '@/types/index';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

interface TimelineChartProps {
    activities : Activity[]
}

 export default function TimelineChart({activities}:TimelineChartProps)  {
    const chartWidth= 350;
    const chartHeight = 80;
    const barHeight = 40;
    const barY = 25;

    const todayActivities = activities
    .filter( activity=> isToday(activity.startTime))
    .sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

    const timeToX= (date: Date) =>{
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const decimalHours = hours + (minutes/60)
        return ((chartWidth/24) * decimalHours)
    };

    const durationToWidth = (seconds:number) =>{
        const hours = seconds/3600;
        return ((chartWidth/24) * hours) 
    };

    if (todayActivities.length === 0){
        return(
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activities Today</Text>
          </View>
        );
    }
    
    return(
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}> No activities today</Text>

            <Svg width={chartWidth} height={chartHeight}>
              {/*  Time axis markers (0,6,12,18,24)*/}
              {
                [0,6,12,18,24].map(hour =>(
                  <React.Fragment key={hour}>
                    {/* Vertical grid line */}
                    <Rect 
                      x={(chartWidth/24) * hour}
                      y={0}
                      width ={1}
                      height = {chartHeight}
                      fill = "#E5E5EA"
                    />
                    {/* Time Label*/}
                    <SvgText
                      x={(chartWidth/24) * hour}
                      y={chartHeight-5}
                      fontSize="10"
                      fill = {Colors.text.light.tertiary}
                      textAnchor="middle"
                    >
                      {hour}
                    </SvgText>
                  </React.Fragment>
                ))
              }
              {/*Activity bars */}
              {
                todayActivities.map(activity =>{
                  const x = timeToX(activity.startTime);
                  const width = durationToWidth(activity.duration);
                  const color = activity.energyState === 'flow'
                    ? Colors.flow
                    :activity.energyState == 'drain'
                    ? Colors.drain
                    : '#CCCCCC';
                    return(
                      <Rect 
                        key = {activity.id}
                        x= {x}
                        y={barY}
                        width = {Math.max(width,2)}
                        height={barHeight}
                        fill = {color}
                        rx ={4}
                      />
                    )
                }
                )
              }
            </Svg>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot,{backgroundColor: Colors.flow}]}>
                  <Text style={styles.legendText}>Flow</Text>
                </View>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot,{backgroundColor: Colors.drain}]}>
                  <Text style={styles.legendText}>Drain</Text>
                </View>
              </View>
            </View>
        </View>
    );
    }

    //Helper functions
    function isToday (date: Date):boolean {
        const today = new Date();
        return  (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  title: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.light.primary,
    marginBottom: Spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: Typography.size.sm,
    color: Colors.text.light.secondary,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.size.base,
    color: Colors.text.light.secondary,
  },
});