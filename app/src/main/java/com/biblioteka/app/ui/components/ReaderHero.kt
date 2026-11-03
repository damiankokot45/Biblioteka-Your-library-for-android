package com.biblioteka.app.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.biblioteka.app.R
import com.biblioteka.app.data.Book
import com.biblioteka.app.ui.LibraryViewModel
import com.biblioteka.app.ui.theme.OnReadingAccent
import com.biblioteka.app.ui.theme.ReadingAccent
import kotlinx.coroutines.delay
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun ReaderHero(
    books: List<Book>,
    readingStartedAt: Long?,
    onStart: () -> Unit,
    onStop: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val isReading = readingStartedAt != null
    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(readingStartedAt) {
        while (readingStartedAt != null) {
            now = System.currentTimeMillis()
            delay(1000)
        }
    }
    val seconds = readingStartedAt?.let { ((now - it) / 1000).coerceIn(0, LibraryViewModel.MAX_SESSION_MS / 1000) } ?: 0L
    val glow by animateFloatAsState(if (isReading) 1f else 0f, tween(1000), label = "glow")
    val primary = MaterialTheme.colorScheme.primary

    Box(
        modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(32.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
            .border(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f), RoundedCornerShape(32.dp)),
    ) {
        // Ambient light while reading.
        Canvas(Modifier.matchParentSize()) {
            if (glow > 0f) {
                drawCircle(
                    brush = Brush.radialGradient(
                        listOf(primary.copy(alpha = 0.2f * glow), Color.Transparent),
                        center = center,
                        radius = 192.dp.toPx(),
                    ),
                    radius = 192.dp.toPx(),
                    center = center,
                )
            }
        }

        Column(
            Modifier.fillMaxWidth().padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            ReadingScene(books = books, isReading = isReading, modifier = Modifier.padding(top = 16.dp))
            Spacer(Modifier.height(24.dp))
            Text(
                stringResource(R.string.reading_time_title),
                style = MaterialTheme.typography.headlineSmall,
                textAlign = TextAlign.Center,
            )
            Spacer(Modifier.height(4.dp))
            Text(
                stringResource(if (isReading) R.string.reading_time_desc_reading else R.string.reading_time_desc_idle),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
            )
            Spacer(Modifier.height(24.dp))

            AnimatedContent(
                targetState = isReading,
                transitionSpec = { (fadeIn() + scaleIn(initialScale = 0.9f)) togetherWith (fadeOut() + scaleOut(targetScale = 0.9f)) },
                modifier = Modifier.heightIn(min = 56.dp),
                label = "timerControls",
            ) { reading ->
                if (!reading) {
                    Button(
                        onClick = onStart,
                        colors = ButtonDefaults.buttonColors(containerColor = ReadingAccent, contentColor = OnReadingAccent),
                        contentPadding = ButtonDefaults.ButtonWithIconContentPadding,
                        modifier = Modifier.height(52.dp),
                    ) {
                        Icon(Icons.Filled.PlayArrow, contentDescription = null)
                        Spacer(Modifier.width(12.dp))
                        Text(stringResource(R.string.start_reading))
                    }
                } else {
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        FilledTonalButton(
                            onClick = onStop,
                            colors = ButtonDefaults.filledTonalButtonColors(
                                containerColor = primary.copy(alpha = 0.2f),
                                contentColor = primary,
                            ),
                            modifier = Modifier.height(52.dp),
                        ) {
                            Icon(Icons.Filled.Stop, contentDescription = null)
                            Spacer(Modifier.width(8.dp))
                            Text(stringResource(R.string.stop_reading))
                        }
                        TimerPill(seconds)
                    }
                }
            }
        }
    }
}

@Composable
private fun TimerPill(seconds: Long) {
    val pulse by rememberInfiniteTransition(label = "pulse").animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
        label = "pulseValue",
    )
    val outline = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
    val primary = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
    Row(
        Modifier
            .clip(RoundedCornerShape(50))
            .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.5f))
            .border(1.dp, androidx.compose.ui.graphics.lerp(outline, primary, pulse), RoundedCornerShape(50))
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Icon(Icons.Outlined.Schedule, contentDescription = null, modifier = Modifier.size(16.dp))
        Text(formatDuration(seconds), fontFamily = FontFamily.Monospace, fontSize = 14.sp)
    }
}

internal fun formatDuration(totalSeconds: Long): String {
    val h = totalSeconds / 3600
    val m = (totalSeconds % 3600) / 60
    val s = totalSeconds % 60
    return when {
        h > 0 -> "${h}h ${m}m ${s}s"
        m > 0 -> "${m}m ${s}s"
        else -> "${s}s"
    }
}

/** Illustration: a small bookcase filled with your books, an armchair and a reading lamp. */
@Composable
private fun ReadingScene(books: List<Book>, isReading: Boolean, modifier: Modifier = Modifier) {
    val outlineVariant = MaterialTheme.colorScheme.outlineVariant
    val primary = MaterialTheme.colorScheme.primary
    val headAngle by animateFloatAsState(
        targetValue = if (isReading) 60f else 45f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessMedium),
        label = "lampHead",
    )
    val light = remember { Animatable(0f) }
    LaunchedEffect(isReading) {
        if (isReading) {
            // A short flicker, like a bulb warming up.
            light.animateTo(0.7f, keyframes {
                durationMillis = 500
                0f at 0
                0.8f at 100
                0.3f at 200
                0.9f at 300
                0.5f at 400
            })
        } else {
            light.animateTo(0f, tween(200))
        }
    }

    Box(modifier.fillMaxWidth().height(224.dp), contentAlignment = Alignment.BottomCenter) {
        // Floor
        Box(
            Modifier
                .fillMaxWidth(0.9f)
                .height(1.dp)
                .background(outlineVariant.copy(alpha = 0.3f)),
        )
        Bookcase(books, Modifier.offset(x = (-68).dp))

        // Armchair + lamp
        Box(Modifier.offset(x = (-8).dp).size(192.dp)) {
            Canvas(Modifier.matchParentSize()) {
                val baseX = size.width - 24.dp.toPx()
                val bottom = size.height
                val stickLen = size.height * 0.9f
                val tilt = Math.toRadians(-10.0)
                val top = Offset(
                    x = baseX + 8.dp.toPx() + (stickLen * sin(tilt)).toFloat(),
                    y = bottom - (stickLen * cos(tilt)).toFloat(),
                )
                // Light cone (drawn first so the head covers its origin).
                if (light.value > 0f) {
                    // Same rotation as the head, so the light leaves through its opening.
                    rotate(headAngle, pivot = top) {
                        val cone = Path().apply {
                            moveTo(top.x - 6.dp.toPx(), top.y)
                            lineTo(top.x + 6.dp.toPx(), top.y)
                            lineTo(top.x + 120.dp.toPx(), top.y + 300.dp.toPx())
                            lineTo(top.x - 120.dp.toPx(), top.y + 300.dp.toPx())
                            close()
                        }
                        drawPath(
                            cone,
                            Brush.verticalGradient(
                                listOf(Color(0xFFFDE047).copy(alpha = 0.4f * light.value), Color.Transparent),
                                startY = top.y,
                                endY = top.y + 300.dp.toPx(),
                            ),
                        )
                    }
                }
                // Stick and base
                drawLine(outlineVariant, Offset(baseX + 8.dp.toPx(), bottom), top, strokeWidth = 6.dp.toPx(), cap = StrokeCap.Round)
                drawRoundRect(
                    outlineVariant,
                    topLeft = Offset(baseX - 24.dp.toPx(), bottom - 8.dp.toPx()),
                    size = Size(48.dp.toPx(), 8.dp.toPx()),
                    cornerRadius = androidx.compose.ui.geometry.CornerRadius(4.dp.toPx()),
                )
                // Lamp head: a dome pivoting on the top of the stick
                rotate(headAngle, pivot = top) {
                    val w = 64.dp.toPx()
                    val h = 40.dp.toPx()
                    drawArc(
                        color = primary.copy(alpha = 0.9f),
                        startAngle = 180f,
                        sweepAngle = 180f,
                        useCenter = true,
                        topLeft = Offset(top.x - w / 2, top.y - h),
                        size = Size(w, h * 2),
                    )
                }
            }
            // The seat and legs overlap upwards by 12 dp, so shift the chair down to stand on the floor.
            Armchair(Modifier.align(Alignment.BottomStart).offset(x = 16.dp, y = 12.dp))
        }
    }
}

@Composable
private fun Bookcase(books: List<Book>, modifier: Modifier = Modifier) {
    val frame = Color(0xFF2D1B11)
    val board = Color(0xFF25150C)
    val spineColors = listOf(
        0xFF8C3C3C, 0xFF3C5A8C, 0xFF3C8C5A, 0xFFC29232, 0xFF724694,
        0xFF467294, 0xFF944672, 0xFFB34D4D, 0xFF4D7EB3, 0xFF56B377,
    ).map { Color(it) }

    Column(
        modifier
            .size(width = 144.dp, height = 192.dp)
            .clip(RoundedCornerShape(2.dp))
            .background(frame)
            .padding(start = 6.dp, end = 6.dp, top = 6.dp)
            .background(Color(0xFF3A271D).copy(alpha = 0.5f)),
    ) {
        repeat(3) { shelf ->
            Column(Modifier.weight(1f).fillMaxWidth()) {
                Row(
                    Modifier.weight(1f).fillMaxWidth().padding(horizontal = 4.dp),
                    verticalAlignment = Alignment.Bottom,
                ) {
                    books.drop(shelf * 10).take(10).forEach { book ->
                        val idNum = book.id.sumOf { it.code }
                        Box(
                            Modifier
                                .padding(horizontal = 0.5.dp)
                                .size(width = (6 + idNum % 4).dp, height = (22 + idNum % 16).dp)
                                .clip(RoundedCornerShape(topStart = 2.dp, topEnd = 2.dp))
                                .background(spineColors[idNum % spineColors.size].copy(alpha = 0.9f)),
                        )
                    }
                }
                Box(Modifier.fillMaxWidth().height(6.dp).background(board))
            }
        }
    }
}

@Composable
private fun Armchair(modifier: Modifier = Modifier) {
    Column(modifier.width(128.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            Modifier
                .size(80.dp)
                .clip(RoundedCornerShape(topStart = 40.dp, topEnd = 40.dp))
                .background(Color(0xFFC08670)),
            contentAlignment = Alignment.BottomCenter,
        ) {
            Box(
                Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp))
                    .background(Color(0xFFA87460).copy(alpha = 0.3f)),
            )
        }
        Box(
            Modifier
                .offset(y = (-8).dp)
                .size(width = 128.dp, height = 40.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color(0xFFE09E86)),
        )
        Row(Modifier.offset(y = (-12).dp).width(96.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            repeat(2) {
                Box(
                    Modifier
                        .size(width = 12.dp, height = 24.dp)
                        .clip(RoundedCornerShape(bottomStart = 2.dp, bottomEnd = 2.dp))
                        .background(Color(0xFF6E5850)),
                )
            }
        }
    }
}
