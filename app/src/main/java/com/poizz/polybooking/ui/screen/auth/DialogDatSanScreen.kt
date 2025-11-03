package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// 🎨 Màu sắc
private val ScreenDark = Color(0xFF585859)
private val DialogWhite = Color.White
private val PillGreen = Color(0xFFD9FAD9)
private val PillPink = Color(0xFFFAD9D9)
private val ButtonGreen = Color(0xFF4CAF50)
private val TextDark = Color(0xFF111111)
private val SubText = Color(0xFF343434)

@Composable
fun ExactDialog(
    modifier: Modifier = Modifier,
    onClose: () -> Unit = {}
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ScreenDark),
        contentAlignment = Alignment.Center
    ) {
        Surface(
            modifier = modifier
                .fillMaxWidth(0.82f)
                .wrapContentHeight(),
            shape = RoundedCornerShape(20.dp),
            color = DialogWhite,
            tonalElevation = 4.dp,
            shadowElevation = 10.dp
        ) {
            Column(
                modifier = Modifier
                    .padding(horizontal = 18.dp, vertical = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // 🏷️ Tiêu đề
                Text(
                    text = "Hình thức đặt sân",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextDark,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp)
                )

                // ✅ Ô xanh
                InfoBox(
                    title = "Đặt lịch ngày thường",
                    subtitle = "Chơi được nhiều khung giờ, nhiều sân.",
                    backgroundColor = PillGreen
                )

                Spacer(modifier = Modifier.height(10.dp))

                // ✅ Ô hồng
                InfoBox(
                    title = "Đặt lịch sự kiện",
                    subtitle = "Tham gia các giải đấu mang tính cạnh tranh và nâng cao trình độ.",
                    backgroundColor = PillPink
                )

                Spacer(modifier = Modifier.height(20.dp))

                // 🔘 Nút quay lại
                Button(
                    onClick = onClose,
                    colors = ButtonDefaults.buttonColors(containerColor = ButtonGreen),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier
                        .fillMaxWidth(0.6f)
                        .height(46.dp)
                ) {
                    Text(
                        text = "Quay lại",
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}

@Composable
fun InfoBox(
    title: String,
    subtitle: String,
    backgroundColor: Color
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(22.dp))
            .background(backgroundColor)
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
        Text(
            text = title,
            color = TextDark,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(3.dp))
        Text(
            text = subtitle,
            color = SubText,
            fontSize = 12.sp,
            lineHeight = 14.sp
        )
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewExactDialog() {
    ExactDialog()
}
