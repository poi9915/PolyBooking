package com.poizz.polybooking.ui.screen.auth

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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun RuleScreen(
    onBackClick: () -> Unit = {},
    onRuleClick: (String) -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color(0xFFE8F5E9), Color(0xFFE9FFF8))))
    ) {
        // 🔹 Thanh tiêu đề (AppBar đẹp & hiện đại)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(58.dp)
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF66BB6A), Color(0xFF43A047))
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            IconButton(
                onClick = onBackClick,
                modifier = Modifier.align(Alignment.CenterStart)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Quay lại",
                    tint = Color.White
                )
            }
            Text(
                text = "Luật đấu",
                fontSize = 20.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 🔹 Danh sách luật
        val rules = listOf(
            "Luật chơi cơ bản",
            "Luật chơi nâng cao",
            "Thuật ngữ trong pickleball",
            "Luật chơi cho người mới"
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            rules.forEach { rule ->
                RuleButton(text = rule) {
                    onRuleClick(rule)
                }
            }
        }
    }
}

@Composable
fun RuleButton(text: String, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
            .background(Color(0xFF4CAF50), RoundedCornerShape(50))
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontSize = 16.sp,
            color = Color.Black,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center
        )
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewRuleScreen() {
    RuleScreen()
}
