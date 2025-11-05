package com.poizz.polybooking.ui.screen.auth
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.poizz.polybooking.R
import com.poizz.polybooking.ui.theme.PolyBookingTheme

@Composable
fun RuleScreen(
    onBackClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFDFFFC8))
    ) {
        // --- Header ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF4CAF50)),

            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                painter = painterResource(id = R.drawable.baseline_arrow_back_24),
                contentDescription = "Back",
                tint = Color.White,
                modifier = Modifier
                    .size(28.dp)
                    .clickable { onBackClick() }
            )

            Text(
                text = "Luật Chơi",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier  
                    .fillMaxWidth()

                    .padding(vertical = 8.dp),
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // --- Danh sách các luật có icon ---
        val rules = listOf(
            RuleItem("Luật chơi cơ bản", R.drawable.pickleball3),
            RuleItem("Luật chơi nâng cao", R.drawable.pickleball1),
            RuleItem("Thuật ngữ trong Pickleball", R.drawable.pickleball2),
            RuleItem("Luật chơi cho người mới", R.drawable.pickleball4)
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            rules.forEach { rule ->
                RuleButtonWithIcon(rule.text, rule.icon)
                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

data class RuleItem(val text: String, val icon: Int)

@Composable
fun RuleButtonWithIcon(text: String, icon: Int) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                color = Color(0xFFFFFFFF),
                shape = RoundedCornerShape(20.dp)
            )
            .clickable { /* TODO: mở chi tiết luật */ }
            .padding(vertical = 12.dp, horizontal = 16.dp),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start
        ) {
            Image(
                painter = painterResource(id = icon),
                contentDescription = text,
                modifier = Modifier
                    .size(width = 150.dp, height = 100.dp)
                    .padding(end = 12.dp)
                    .clip(RoundedCornerShape(10.dp))
            )
            Text(
                text = text,
                fontSize = 15.sp,
                color = Color.Black,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
@Preview(showBackground = true)
@Composable
fun PreviewLuatDauScreen() {
    PolyBookingTheme {
        RuleScreen()
    }
}
