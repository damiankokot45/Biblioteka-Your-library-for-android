package com.biblioteka.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

public class ReadingWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.reading_widget);

        Intent startIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("biblioteka://action/start"));
        startIntent.setPackage(context.getPackageName());
        PendingIntent pendingStart = PendingIntent.getActivity(context, 0, startIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.btn_start_reading, pendingStart);

        Intent stopIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("biblioteka://action/stop"));
        stopIntent.setPackage(context.getPackageName());
        PendingIntent pendingStop = PendingIntent.getActivity(context, 1, stopIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.btn_stop_reading, pendingStop);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
