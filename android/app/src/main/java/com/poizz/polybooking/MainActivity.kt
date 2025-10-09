package com.poizz.polybooking

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.poizz.polybooking.ui.screen.MainApp
import com.poizz.polybooking.ui.theme.PolyBookingTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PolyBookingTheme {
                MainApp()
            }
        }
    }
}
