package com.biblioteka.app.ui

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.border
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.TrendingUp
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.os.ConfigurationCompat
import com.biblioteka.app.R
import com.biblioteka.app.data.Book
import com.biblioteka.app.data.ReadingStats
import com.biblioteka.app.ui.theme.ReadingAccent
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

@Composable
fun StatsScreen(books: List<Book>, modifier: Modifier = Modifier) {
    if (books.isEmpty()) {
        Column(
            modifier.fillMaxWidth().padding(vertical = 80.dp, horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(
                Icons.AutoMirrored.Outlined.TrendingUp,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
            )
            Spacer(Modifier.height(16.dp))
            Text(stringResource(R.string.empty_stats_title), style = MaterialTheme.typography.titleLarge)
            Spacer(Modifier.height(8.dp))
            Text(
                stringResource(R.string.empty_stats_desc),
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
            )
        }
        return
    }

    val stats = remember(books) { ReadingStats.compute(books) }
    val locale = ConfigurationCompat.getLocales(LocalConfiguration.current)[0] ?: Locale.getDefault()
    val numberFormat = remember(locale) { NumberFormat.getIntegerInstance(locale) }

    Column(modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(24.dp)) {
        StatsCard {
            Text(
                stringResource(R.string.this_year),
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(24.dp))
            Row(Modifier.fillMaxWidth()) {
                StatTile(stats.readCount.toString(), stringResource(R.string.books_read), Modifier.weight(1f))
                StatTile(stats.addedCount.toString(), stringResource(R.string.books_added), Modifier.weight(1f))
            }
            Spacer(Modifier.height(24.dp))
            Row(Modifier.fillMaxWidth()) {
                StatTile(numberFormat.format(stats.pagesRead), stringResource(R.string.pages_read), Modifier.weight(1f))
                StatTile("${stats.timeSpentHours}h", stringResource(R.string.time_spent), Modifier.weight(1f))
            }
        }

        StatsCard {
            Text(stringResource(R.string.reading_progress), style = MaterialTheme.typography.titleSmall)
            Spacer(Modifier.height(24.dp))
            MonthlyChart(stats.monthly, locale, Modifier.fillMaxWidth().height(160.dp))
        }
    }
}

@Composable
private fun StatsCard(content: @Composable () -> Unit) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f))
            .border(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f), RoundedCornerShape(24.dp))
            .padding(24.dp),
    ) { content() }
}

@Composable
private fun StatTile(value: String, label: String, modifier: Modifier = Modifier) {
    Column(modifier) {
        Text(value, style = MaterialTheme.typography.headlineSmall)
        Text(label, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(top = 4.dp))
    }
}

/** Books finished per month, as a smooth line with dots (replaces the Recharts line chart). */
@Composable
private fun MonthlyChart(values: List<Int>, locale: Locale, modifier: Modifier = Modifier) {
    val labelColor = MaterialTheme.colorScheme.onSurfaceVariant
    val measurer = rememberTextMeasurer()
    val months = remember(locale) {
        val fmt = SimpleDateFormat("LLL", locale)
        val cal = Calendar.getInstance()
        (0 until 12).map { m ->
            cal.set(2000, m, 1)
            fmt.format(cal.time).take(3)
        }
    }
    val progress = remember { Animatable(0f) }
    LaunchedEffect(values) {
        progress.snapTo(0f)
        progress.animateTo(1f, tween(800))
    }
    val labelStyle = TextStyle(fontSize = 11.sp, color = labelColor)
    val valueStyle = TextStyle(fontSize = 10.sp, color = ReadingAccent)

    Canvas(modifier) {
        val labelHeight = 24.dp.toPx()
        val top = 16.dp.toPx()
        val chartHeight = size.height - labelHeight - top
        val pad = 10.dp.toPx()
        val stepX = (size.width - 2 * pad) / (values.size - 1)
        val max = (values.maxOrNull() ?: 0).coerceAtLeast(1)
        val points = values.mapIndexed { i, v ->
            Offset(pad + i * stepX, top + chartHeight * (1f - v.toFloat() / max * progress.value))
        }

        // Monotone-ish smooth curve through the points.
        val path = Path().apply {
            moveTo(points.first().x, points.first().y)
            for (i in 1 until points.size) {
                val p0 = points[i - 1]
                val p1 = points[i]
                val midX = (p0.x + p1.x) / 2
                cubicTo(midX, p0.y, midX, p1.y, p1.x, p1.y)
            }
        }
        drawPath(path, ReadingAccent, style = Stroke(width = 2.5.dp.toPx(), cap = StrokeCap.Round))
        points.forEachIndexed { i, p ->
            drawCircle(ReadingAccent, radius = 4.dp.toPx(), center = p)
            if (values[i] > 0) {
                val text = measurer.measure(values[i].toString(), valueStyle)
                drawText(text, topLeft = Offset(p.x - text.size.width / 2f, p.y - text.size.height - 4.dp.toPx()))
            }
            val label = measurer.measure(months[i], labelStyle)
            drawText(label, topLeft = Offset(p.x - label.size.width / 2f, size.height - label.size.height))
        }
    }
}
