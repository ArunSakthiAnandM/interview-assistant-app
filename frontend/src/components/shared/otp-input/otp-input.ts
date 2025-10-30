import { Component, input, output, signal, effect, ElementRef, viewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OTP_CONFIG } from '../../../constants';

/**
 * OTP Input Component
 * Reusable component for entering OTP with auto-focus and keyboard navigation
 */
@Component({
  selector: 'app-otp-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './otp-input.html',
  styleUrl: './otp-input.scss',
})
export class OtpInputComponent {
  // Inputs
  length = input<number>(OTP_CONFIG.LENGTH);
  disabled = input<boolean>(false);

  // Outputs
  otpChange = output<string>();
  otpComplete = output<string>();

  // Signals
  otpDigits = signal<string[]>([]);

  // View children
  inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  constructor() {
    // Initialize OTP digits array
    effect(() => {
      const len = this.length();
      this.otpDigits.set(new Array(len).fill(''));
    });
  }

  /**
   * Handle input change
   */
  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    // Update digits array
    const digits = [...this.otpDigits()];
    digits[index] = value;
    this.otpDigits.set(digits);

    // Emit OTP change
    const otp = digits.join('');
    this.otpChange.emit(otp);

    // Move to next input if value entered
    if (value && index < this.length() - 1) {
      this.focusInput(index + 1);
    }

    // Emit complete event if all digits entered
    if (otp.length === this.length() && !otp.includes('')) {
      this.otpComplete.emit(otp);
    }
  }

  /**
   * Handle keydown events for navigation
   */
  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      // Clear current digit
      const digits = [...this.otpDigits()];
      digits[index] = '';
      this.otpDigits.set(digits);
      this.otpChange.emit(digits.join(''));

      // Move to previous input if current is empty
      if (!input.value && index > 0) {
        this.focusInput(index - 1);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      event.preventDefault();
      this.focusInput(index + 1);
    } else if (event.key === 'Delete') {
      // Clear current digit
      const digits = [...this.otpDigits()];
      digits[index] = '';
      this.otpDigits.set(digits);
      this.otpChange.emit(digits.join(''));
    }
  }

  /**
   * Handle paste event
   */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData) {
      // Extract only digits
      const digits = pastedData.replace(/\D/g, '').split('').slice(0, this.length());

      if (digits.length > 0) {
        // Fill in the digits
        const newDigits = new Array(this.length()).fill('');
        digits.forEach((digit, i) => {
          if (i < this.length()) {
            newDigits[i] = digit;
          }
        });

        this.otpDigits.set(newDigits);
        const otp = newDigits.join('');
        this.otpChange.emit(otp);

        // Focus on the next empty input or last input
        const nextEmptyIndex = newDigits.findIndex((d) => !d);
        if (nextEmptyIndex !== -1) {
          this.focusInput(nextEmptyIndex);
        } else {
          this.focusInput(this.length() - 1);
          this.otpComplete.emit(otp);
        }
      }
    }
  }

  /**
   * Focus specific input
   */
  private focusInput(index: number): void {
    setTimeout(() => {
      const inputElements = this.inputs();
      if (inputElements && inputElements[index]) {
        inputElements[index].nativeElement.focus();
        inputElements[index].nativeElement.select();
      }
    }, 0);
  }

  /**
   * Clear all digits
   */
  clear(): void {
    this.otpDigits.set(new Array(this.length()).fill(''));
    this.otpChange.emit('');
    this.focusInput(0);
  }

  /**
   * Get current OTP value
   */
  getValue(): string {
    return this.otpDigits().join('');
  }
}
